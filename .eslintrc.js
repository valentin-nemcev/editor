/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

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
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:jest/recommended',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'prettier/standard',
    ],
    env: {
        browser: true,
        es6: true,
    },
    rules: {
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',

        '@typescript-eslint/explicit-function-return-type': 'off',

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
