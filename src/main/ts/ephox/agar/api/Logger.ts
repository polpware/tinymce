import { Arr, Fun } from '@ephox/katamari';

import * as ErrorTypes from '../alien/ErrorTypes';
import { DieFn, NextFn, RunFn } from '../pipe/Pipe';

const t = function <T, U>(label: string, f: RunFn<T, U>): RunFn<T, U> {
  const enrich = function (err) {
    return ErrorTypes.enrichWith(label, err);
  };

  return function (value: T, next: NextFn<U>, die: DieFn) {
    const dieWith: DieFn = Fun.compose(die, enrich);
    try {
      return f(value, next, dieWith);
    } catch (err) {
      dieWith(err);
    }
  };
};

const sync = function <T>(label: string, f: () => T): T {
  const enrich = function (err) {
    return ErrorTypes.enrichWith(label, err);
  };

  try {
    return f();
  } catch (err) {
    throw enrich(err);
  }
};

const ts = function <T, U>(label: string, fs: RunFn<T, U>[]) {
  if (fs.length === 0) return fs;
  return Arr.map(fs, function (f: RunFn<T, U>, i: number) {
    return t(label + '(' + i + ')', f);
  });
};

const suite = function () {
  // TMP, WIP
};

const spec = function (msg) {
  // TMP, WIP
  console.log(msg);
};

export {
  t,
  ts,
  sync,
  suite,
  spec
};