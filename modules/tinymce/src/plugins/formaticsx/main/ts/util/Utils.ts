function isQuestionVarTag(elm: Element) {
    return elm && elm.nodeName === 'VAR' && elm.className.indexOf('formatics-question-') !== -1;
}

function trimArg<T>(predicateFn: (a: T) => boolean) {
    return function(arg1: any, arg2: T) {
        return predicateFn(arg2);
    };
}

export {
    isQuestionVarTag,
    trimArg
};
