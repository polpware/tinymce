import { Optional } from '@ephox/katamari';
import DOMUtils from 'tinymce/core/api/dom/DOMUtils';
import Editor from 'tinymce/core/api/Editor';
import * as Utils from '../util/Utils';
import * as Settings from '../api/Settings';
import * as Prism from './Prism';

const getSelectedQuestionVarTag = (editor: Editor) => {
  const node = editor.selection ? editor.selection.getNode() : null;

  if (Utils.isQuestionVarTag(node)) {
    return Optional.some(node);
  }

  return Optional.none<Element>();
};

const insertQuestionVarTag = (editor: Editor, questionVar: string) => {
  editor.undoManager.transact(() => {
    const node = getSelectedQuestionVarTag(editor);

    const questions = Settings.getQuestionVars(editor);
    const anyQ = questions.find((a) => a.value === questionVar);

    const questionLabel = DOMUtils.DOM.encode(anyQ.text);

    return node.fold(() => {
      editor.insertContent('<var id="__new" class="formatics-question-' + questionVar + '">' + questionLabel + '</var>');
      editor.selection.select(editor.$('#__new').removeAttr('id')[0]);
    }, (n) => {
      editor.dom.setAttrib(n, 'class', 'formatics-question-' + questionVar);
      n.innerHTML = questionLabel;
      Prism.get(editor).highlightElement(n);
      editor.selection.select(n);
    });
  });
};

const getCurrentQuestionVarTag = (editor: Editor): string => {
  const node = getSelectedQuestionVarTag(editor);
  return node.fold(() => '', (n) => n.textContent);
};

const getCurrentQuestionVar = (editor: Editor, fallback: string): string => {
  const node = getSelectedQuestionVarTag(editor);

  return node.fold(() => fallback, (n) => {
    const matches = n.className.match(/formatics-question-(\w+)/);
    return matches ? matches[1] : fallback;
  });
};

export {
  getSelectedQuestionVarTag,
  insertQuestionVarTag,
  getCurrentQuestionVarTag,
  getCurrentQuestionVar
};
