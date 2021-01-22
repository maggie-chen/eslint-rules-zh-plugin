const eslintRules = require('./eslint-rules.js');
const eslintVueRules = require('./eslint-vue-rules.js');

module.exports = {
    ...eslintRules,
    ...eslintVueRules
}