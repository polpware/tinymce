import PluginManager from 'tinymce/core/api/PluginManager';
import * as Commands from './api/Commands';
import * as Buttons from './ui/Buttons';
import * as Dialog from './ui/Dialog';
import * as Utils from './util/Utils';

export default function () {
  PluginManager.add('formaticsx', function (editor) {
    Buttons.register(editor);
    Commands.register(editor);

    editor.on('dblclick', function (ev) {
      if (Utils.isQuestionVarTag(ev.target)) {
        Dialog.open(editor);
      }
    });
  });
}

