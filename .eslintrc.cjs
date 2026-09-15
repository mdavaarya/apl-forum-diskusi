module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'react/jsx-props-no-spreading': 'off',
    'no-alert': 'off',
    'react/jsx-one-expression-per-line': 'off',
    // Redux Toolkit slices use Immer, which relies on mutating draft "state"
    // arguments inside reducers/extraReducers by design.
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.js',
          '**/*.test.jsx',
          'src/setupTests.js',
          'vite.config.js',
          'cypress.config.js',
        ],
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules', 'vite.config.js', 'cypress'],
};
