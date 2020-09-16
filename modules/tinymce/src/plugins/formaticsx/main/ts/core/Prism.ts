import { Global } from '@ephox/katamari';
import Prism from '@ephox/wrap-prismjs';
import Editor from 'tinymce/core/api/Editor';
import * as Settings from '../api/Settings';

const get = (editor: Editor) => Global.Prism && Settings.useGlobalPrismJS(editor) ? Global.Prism : Prism;

export {
  get
};
