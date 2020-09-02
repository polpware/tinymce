import { Assertions, Log, Pipeline, Step } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { TinyApis, TinyLoader } from '@ephox/mcagar';
import Editor from 'tinymce/core/api/Editor';

UnitTest.asyncTest('LineHeightTest', (success, failure) => {
  TinyLoader.setupLight((editor: Editor, success, failure) => {
    const api = TinyApis(editor);

    const sAssertHeight = (value: string) => Step.sync(() => {
      const current = editor.queryCommandValue('LineHeight');
      Assertions.assertEq('LineHeight query command returned wrong value', value, current);
    });

    Pipeline.async({}, [
      Log.stepsAsStep('TINY-4843', 'Specified line-height can be read from element', [
        api.sSetContent('<p style="line-height: 1.5;">Test</p>'),
        api.sSetCursor([ 0, 0 ], 0),
        sAssertHeight('1.5')
      ]),

      Log.stepsAsStep('TINY-4843', 'Specified line-height can be read from element in px', [
        api.sSetContent('<p style="line-height: 20px;">Test</p>'),
        api.sSetCursor([ 0, 0 ], 0),
        sAssertHeight('20px')
      ]),

      Log.stepsAsStep('TINY-4843', 'Specified line-height can be read from ancestor element', [
        api.sSetContent('<p style="line-height: 1.8;">Hello, <strong>world</strong></p>'),
        api.sSetCursor([ 0, 1, 0 ], 0),
        sAssertHeight('1.8')
      ]),

      Log.stepsAsStep('TINY-4843', 'Editor command can set line-height', [
        api.sSetContent('<p>Hello</p>'),
        api.sSetCursor([ 0, 0 ], 0),
        api.sExecCommand('LineHeight', '2'),
        api.sAssertContent('<p style="line-height: 2;">Hello</p>')
      ]),

      Log.stepsAsStep('TINY-4843', 'Editor command can alter line-height', [
        api.sSetContent('<p style="line-height: 1.8;">Hello</p>'),
        api.sSetCursor([ 0, 0 ], 0),
        api.sExecCommand('LineHeight', '2'),
        api.sAssertContent('<p style="line-height: 2;">Hello</p>')
      ]),

      Log.stepsAsStep('TINY-4843', 'Editor command can toggle line-height', [
        api.sSetContent('<p style="line-height: 1.4;">Hello</p>'),
        api.sSetCursor([ 0, 0 ], 0),
        api.sExecCommand('LineHeight', '1.4'),
        api.sAssertContent('<p>Hello</p>')
      ])
    ], success, failure);
  }, {
    base_url: '/project/tinymce/js/tinymce'
  }, success, failure);
});
