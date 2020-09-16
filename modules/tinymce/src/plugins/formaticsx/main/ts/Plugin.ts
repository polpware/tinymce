import PluginManager from 'tinymce/core/api/PluginManager';
import * as Keys from './core/Keys';

export default function () {
  PluginManager.add('autolink', function (editor) {
    Keys.setup(editor);
  });
}
