const vscode = require('vscode');
const eslintRules = require('../api');


function provideHover(document, position) {
    const diagnostics = vscode.languages
        .getDiagnostics(document.uri)
        .filter((diagnostic) => diagnostic.source === 'eslint' && position.line === diagnostic.range.start.line && position.character >= diagnostic.range.start.character && (position.character <= diagnostic.range.end.character || position.line < diagnostic.range.end.line));
    if (diagnostics && diagnostics.length > 0) {
        if (typeof diagnostics[0].code === 'object') {
            const ruleId = String(diagnostics[0].code.value);
            const rule = eslintRules[ruleId];
            let url = 'https://eslint.bootcss.com/docs/rules/' + ruleId;
            if (/vue/.test(ruleId)) { // eslint-plugin-vue 规则
                url = 'https://eslint.vuejs.org/rules/' + ruleId.replace('vue/', '');
            }
            return {
                contents: [new vscode.MarkdownString('$(lightbulb) [ESLint规则：' + rule.zh + '](' + url + ') ', true)]
            };
        } else {
            return;
        }
    }
    return;
}

// 激活插件
function activate(context) {

    const selector = [];
    for (const language of ['javascript', 'javascriptreact', 'vue']) {
        selector.push({ language, scheme: 'file' });
        selector.push({ language, scheme: 'untitled' });
    }

    // 注册鼠标悬停提示
    context.subscriptions.push(vscode.languages.registerHoverProvider(selector, {
        provideHover
    }));
}

module.exports = {
    activate
}