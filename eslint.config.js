import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    { ignores: ['**/node_modules', '**/dist', '**/.expo', '**/build'] },
    js.configs.recommended,

    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: [
                    './frontend/tsconfig.json',
                    './backend/tsconfig.json',
                ],
                tsconfigRootDir: process.cwd(),
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react,
            'react-hooks': reactHooks,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            ...prettier.rules,

            // Reglas personalizadas (como en tu config JS)
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'no-unused-vars': 'warn',
            'no-console': 'warn',
            'react/react-in-jsx-scope': 'off',
            indent: ['error', 4, { SwitchCase: 1 }],
            'jsx-quotes': ['error', 'prefer-double'],
            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],
            'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
            'react/self-closing-comp': 'error',
            'react/jsx-tag-spacing': [
                'error',
                {
                    beforeSelfClosing: 'always',
                    afterOpening: 'never',
                    closingSlash: 'never',
                },
            ],
            'react/jsx-curly-spacing': [
                'error',
                { when: 'never', children: true },
            ],
            'react/jsx-equals-spacing': ['error', 'never'],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: [
            '**/*.config.js',
            '**/babel.config.js',
            '**/metro.config.js',
            '**/*.cjs',
        ],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ['**/*.test.ts', '**/*.test.tsx'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
];
