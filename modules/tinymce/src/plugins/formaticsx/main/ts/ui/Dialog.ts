import Editor from 'tinymce/core/api/Editor';
import { QuestionVarSpec } from '../core/QuestionVars';
import { getQuestionVars } from '../core/api/Settings';
import * as QuestionVarTag from '../core/QuestionVarTag';

const open = (editor: Editor) => {
    const questionVars: QuestionVarSpec[] = getQuestionVars(editor);
    const currentQuestionVar: string = QuestionVarTag.getCurrentQuestionVar(editor, '');

    editor.windowManager.open({
        title: 'Select a question',
        size: 'normal',
        body: {
            type: 'panel',
            items: [
                {
                    type: 'selectbox',
                    name: 'question',
                    label: 'Question',
                    items: questionVars
                }
            ]
        },
        buttons: [
            {
                type: 'cancel',
                name: 'cancel',
                text: 'Cancel'
            },
            {
                type: 'submit',
                name: 'save',
                text: 'Save',
                primary: true
            }
        ],
        initialData: {
            question: currentQuestionVar
        },
        onSubmit: (api) => {
            const data = api.getData();
            QuestionVarTag.insertQuestionVarTag(editor, data.question);
            api.close();
        }
    });
};

export {
    open
};
