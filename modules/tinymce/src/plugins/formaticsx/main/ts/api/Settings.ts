
import Editor from 'tinymce/core/api/Editor';
import * as QuestionVars from '../core/QuestionVars';

const getQuestionVars = (editor: Editor) => editor.getParam('formaticsx_questions') as QuestionVars.QuestionVarSpec[];

const useGlobalPrismJS = (editor: Editor) => editor.getParam('formaticsx_global_prismjs', false, 'boolean');

export {
  getQuestionVars,
  useGlobalPrismJS
};
