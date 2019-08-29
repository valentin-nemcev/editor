const {join} = require('path');

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: join(__dirname, '/tsconfig.json.json'),
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'json', 'react', 'prettier', 'jest'],
    extends: [
        'standard',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'prettier/standard',
        'plugin:jest/recommended',
    ],
    env: {
        browser: true,
        es6: true,
    },
    rules: {
        'prettier/prettier': [
            'warn',
            {
                parser: 'typescript',
                trailingComma: 'all',
                tabWidth: 4,
                semi: true,
                singleQuote: true,
                jsxSingleQuote: true,
                bracketSpacing: false,
            },
        ],
    },
};
