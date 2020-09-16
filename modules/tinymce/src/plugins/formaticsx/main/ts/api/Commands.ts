import Editor from 'tinymce/core/api/Editor';
import * as Dialog from '../ui/Dialog';
import * as Utils from '../util/Utils';

const register = function (editor: Editor) {
  editor.addCommand('formaticsx', function () {
    const node = editor.selection.getNode();
    if (editor.selection.isCollapsed() || Utils.isQuestionVarTag(node)) {
      Dialog.open(editor);
    } else {
      editor.formatter.toggle('code');
    }
  });
};

export {
  register
};
