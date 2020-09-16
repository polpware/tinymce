declare let tinymce: any;

tinymce.init({
    selector: 'textarea.tinymce',
    plugins: 'formaticsx code',
    toolbar: 'formaticsx code',
    content_css: '../../../../../js/tinymce/skins/content/default/content.css',
    height: 600,
    formaticsx_questions: [
        { text: 'Question 1', value: 'var1' },
        { text: 'Question 2', value: 'var2' },
        { text: 'Question 3', value: 'var3' }
    ]
});

tinymce.init({
    selector: 'div.tinymce',
    inline: true,
    plugins: 'formaticsx code',
    toolbar: 'formaticsx code',
    content_css: '../../../../../js/tinymce/skins/content/default/content.css',
    height: 600,
    formaticsx_questions: [
        { text: 'Question 1', value: 'var1' },
        { text: 'Question 2', value: 'var2' },
        { text: 'Question 3', value: 'var3' }
    ]
});

export { };
