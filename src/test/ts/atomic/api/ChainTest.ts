import { UnitTest } from '@ephox/bedrock';
import { Chain } from 'ephox/agar/api/Chain';
import * as Logger from 'ephox/agar/api/Logger';
import { Pipeline } from 'ephox/agar/api/Pipeline';
import * as Step from 'ephox/agar/api/Step';
import StepAssertions from 'ephox/agar/test/StepAssertions';

UnitTest.asynctest('ChainTest', function() {
  const success = arguments[arguments.length - 2];
  const failure = arguments[arguments.length - 1];

  const cIsEqual = function (expected) {
    return Chain.on(function (actual, next, die) {
      if (expected === actual) next(Chain.wrap(actual));
      else die('Cat is not a dog');
    });
  };

  const cIsEqualAndChange = function (expected, newValue) {
    return Chain.on(function (actual, next, die) {
      if (expected === actual) next(Chain.wrap(newValue));
      else die('Cat is not a dog');
    });
  };

  const acc = function (ch) {
    return Chain.on(function (input, next, die) {
      next(Chain.wrap(input + ch));
    });
  };
  const testInputValueFails = StepAssertions.testStepsFail(
    'Output value is not a chain: dog', 
    [
      Chain.asStep({}, [
        Chain.on(function (cInput, cNext, cDie) {
          cNext(<any>'dog');
        })
      ])
    ]
  );

  const testInputValuePasses = StepAssertions.testStepsPass(
    {},
    [
      Chain.asStep({}, [
        Chain.on(function (cInput, cNext, cDie) {
          cNext(Chain.wrap('doge'));
        })
      ])
    ]
  );

  const testChainingFails = StepAssertions.testStepsFail(
    'Cat is not a dog',
    [
      Chain.asStep({}, [
        Chain.inject('dog'),
        cIsEqual('cat')
      ])
    ]
  );

  const testChainingPasses = StepAssertions.testStepsPass(
    {},
    [
      Chain.asStep('value', [
        Chain.inject('cat'),
        cIsEqual('cat')
      ])
    ]
  );

  const testChainingFailsBecauseChanges = StepAssertions.testStepsFail(
   'Cat is not a dog',
   [
     Chain.asStep('value', [
       Chain.inject('cat'),
       cIsEqualAndChange('cat', 'new.cat'),
       cIsEqualAndChange('cat', 'new.dog')
     ])
   ]
 );

  const testChainParentPasses = StepAssertions.testStepsPass(
    {},
    [
      Chain.asStep({}, [
        Chain.fromParent(
          Chain.inject('cat'),
          [
            cIsEqualAndChange('cat', 'new.cat'),
            cIsEqualAndChange('cat', 'new.dog'),
            cIsEqualAndChange('cat', 'new.elephant')
          ]
        )
      ])
    ]
  );

  const testChainParentAcc = StepAssertions.testChain(
    'Sentence: ',
    Chain.fromParent(
      Chain.inject('Sentence: '), [
        acc('T'),
        acc('h'),
        acc('i'),
        acc('s')
      ]
    )
  );

  const testChainAcc = StepAssertions.testChain(
    'Sentence: This',
    Chain.fromChainsWith('Sentence: ', [
      acc('T'),
      acc('h'),
      acc('i'),
      acc('s')
    ])
  );

  const testChainEnforcesInput = StepAssertions.testStepsFail(
    'Input Value is not a chain: raw.input',
    [
      Step.async(function (next, die) {
        Chain.on(function (input: any, n, d) {
          n(input);
        }).runChain(<any>'raw.input', next, die);
      })
    ]
  );

  return Pipeline.async({}, [
    Logger.t(
      '[Should fail validation if the chain function does not wrap the output]\n',
      testInputValueFails
    ),
    Logger.t(
      '[Should pass validation if the chain function does wrap the output]\n',
      testInputValuePasses
    ),
    Logger.t(
      '[When a previous link passes a failure that fails a chain, the step should fail]\n',
      testChainingFails
    ),
    Logger.t(
      '[When the last link passes a success, the step should pass]\n',
      testChainingPasses
    ),
    Logger.t(
      '[When using parent, each chain gets the first input]\n',
      testChainParentPasses
    ),
    Logger.t(
      '[When not using parent, if the chain changes the value, subsequent asserts fail]\n',
      testChainingFailsBecauseChanges
    ),
    Logger.t(
      '[When using parent, chains do not accumulate when passing]\n',
      testChainParentAcc
    ),
    Logger.t(
      '[When using fromChains, chains do accumulate when passing]\n',
      testChainAcc
    ),
    Logger.t(
      '[Chains should enforce input conditions]\n',
      testChainEnforcesInput
    ),

    Logger.t(
      '[Basic API: Chain.log]\n',
      Chain.asStep({}, [
        Chain.log('message')
      ])
    ),

    Logger.t(
      '[Basic API: Chain.debugging]\n',
      Chain.asStep({}, [
        Chain.debugging
      ])
    ),

    Logger.t(
      '[Basic API: Chain.wait]\n',
      Chain.asStep({}, [
        Chain.wait(1000)
      ])
    )
  ], function () {
    success();
  }, failure);
});

