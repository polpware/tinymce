import Editor from 'tinymce/core/api/Editor';
import * as Dialog from './Dialog';

const isFormaticsxSelection = (editor: Editor) => {
    const node = editor.selection.getStart();
    return editor.dom.is(node, 'pre[class*="formatics-questions-"]');
};

const register = function(editor: Editor) {
    editor.ui.registry.addToggleButton('formaticsx', {
        icon: 'code-sample',
        tooltip: 'Select questions',
        onAction: () => Dialog.open(editor),
        onSetup: (api) => {
            const nodeChangeHandler = () => {
                api.setActive(isFormaticsxSelection(editor));
            };
            editor.on('NodeChange', nodeChangeHandler);
            return () => editor.off('NodeChange', nodeChangeHandler);
        }
    });

    editor.ui.registry.addMenuItem('formaticsx', {
        text: 'Select questions...',
        icon: 'code-sample',
        onAction: () => Dialog.open(editor)
    });
};

export {
    register
};
