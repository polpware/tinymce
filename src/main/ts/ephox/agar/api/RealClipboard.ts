import { PlatformDetection } from '@ephox/sand';

import { KeyModifiers } from '../keyboard/FakeKeys';
import * as SeleniumAction from '../server/SeleniumAction';
import { RealKeys } from './RealKeys';

const platform = PlatformDetection.detect();

const sImportToClipboard = function <T>(filename: string) {
  return SeleniumAction.sPerform<T>('/clipboard', {
    'import': filename
  });
};

const sCopy = function <T>(selector: string) {
  const modifiers: KeyModifiers = platform.os.isOSX() ? { metaKey: true } : { ctrlKey: true };
  return RealKeys.sSendKeysOn<T>(selector, [
    RealKeys.combo(modifiers, 'c')
  ]);
};

const sPaste = function <T>(selector: string) {
  const modifiers: KeyModifiers = platform.os.isOSX() ? { metaKey: true } : { ctrlKey: true };
  return RealKeys.sSendKeysOn<T>(selector, [
    RealKeys.combo(modifiers, 'v')
  ]);
};

export {
  sImportToClipboard,
  sCopy,
  sPaste
};