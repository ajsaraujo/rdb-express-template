module.exports = {
    env: {
        es2020: true,
        node: true,
        mocha: true
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        indent: ['error', 4],
        semi: 2,
        'arrow-parens': 'off',
        'comma-dangle': 'off',
        'linebreak-style': 'off',
        'function-paren-newline': 'off',
    },
    overrides: [
        {
            files: ['test/**/*Test.js', 'test/**/TestUtils.js'],
            rules: {
                'no-unused-expressions': 'off'
            },
            globals: {
                returnItself: true,
                expect: true,
                TestUtils: true,
                createSandbox: true
            }
        }
    ],
};
