import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['node_modules', 'css', 'scss', 'assets'],
  },
  {
    files: ['js/**/*.{ts,js}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single']
    },
  },
];
