module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        jest: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: 0,
        eqeqeq: 'error',
        'arrow-spacing': ['error', { before: true, after: true }],
        'no-console': 0,
    },
};
