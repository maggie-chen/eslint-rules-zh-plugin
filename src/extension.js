const vscode = require('vscode');
const eslintRules = require('../rules');
const RULE_URL = require('./const/rule-urls');

function provideHover(document, position) {
    const diagnostics = vscode.languages
        .getDiagnostics(document.uri)
        .filter((diagnostic) => {
            if (diagnostic.source !== 'eslint') {
                return false;
            }
            if (position.line === diagnostic.range.start.line && position.line === diagnostic.range.end.line && position.character >= diagnostic.range.start.character && position.character <= diagnostic.range.end.character) { // 单行
                return true;
            } else if (position.line >= diagnostic.range.start.line && position.line <= diagnostic.range.end.line) { // 多行
                return true;
            }
            return false;
        });
    if (diagnostics && diagnostics.length > 0) {
        const contents = diagnostics.map((diagnostic) => {
            if (typeof diagnostic.code === 'object') {
                const ruleId = String(diagnostic.code.value);
                const rule = eslintRules[ruleId];
                let url = RULE_URL.BASE + ruleId;
                if (/vue/.test(ruleId)) { // eslint-plugin-vue 规则
                    url = RULE_URL.VUE + ruleId.replace('vue/', '');
                } else if (/react/.test(ruleId)) { // eslint-plugin-react 规则
                    url = RULE_URL.REACT + ruleId.replace('react/', '') + '.md';
                }
                return new vscode.MarkdownString('$(lightbulb) [ESLint提示：' + rule.zh + '](' + url + ') ', true)
            } else {
                return null;
            }
        }).filter(diagnostic => !!diagnostic)
        return contents.length ? {
            contents
        } : null
    }
    return;
}

// 激活插件
function activate(context) {

    const selector = [];
    for (const language of ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue']) {
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