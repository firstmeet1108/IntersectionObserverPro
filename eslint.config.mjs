import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...ts.configs.recommended,
  { ignores: ['dist/'] },
  {
    rules: {
      'comma-spacing': ['error', { before: false, after: true }], // 逗号后空格
      'object-curly-spacing': ['error', 'always'], // 对象内空格
      '@typescript-eslint/no-unused-vars': 'warn', // 未使用变量
      'no-console': 'error', // 未使用console
    },
  },
];
