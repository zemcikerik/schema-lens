import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', 'node_modules'],
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/contextual-lifecycle': ['error'],
      '@angular-eslint/require-lifecycle-on-prototype': ['warn'],
      '@angular-eslint/sort-lifecycle-methods': ['warn'],
      '@angular-eslint/prefer-standalone': ['error'],
      '@angular-eslint/prefer-on-push-component-change-detection': ['error'],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {
      '@angular-eslint/template/prefer-self-closing-tags': ["error"],
      '@angular-eslint/template/prefer-ngsrc': ["warn"],
      '@angular-eslint/template/prefer-control-flow': ["error"],
    },
  },
];
