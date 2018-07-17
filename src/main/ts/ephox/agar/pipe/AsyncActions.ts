import { DieFn } from './Pipe';

const delay = function (amount: number) {
  return function (next: () => void, die: DieFn) {
    setTimeout(function () {
      next();
    }, amount);
  };
};

// Not really async, but can fail.
const fail = function (message: string) {
  return function (next: () => void, die: DieFn) {
    die('Fake failure: ' + message);
  };
};

export {
  delay,
  fail
};