const eslintRules = require('./base.js');
const eslintVueRules = require('./vue.js');
const eslintReactRules = require('./react.js');
console.log(eslintReactRules)

module.exports = {
    ...eslintRules,
    ...eslintVueRules,
    ...eslintReactRules
}