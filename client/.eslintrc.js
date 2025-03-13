module.exports = {
  root: true,
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  plugins: ['react', 'react-hooks', 'import', 'jsx-a11y', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react/react-in-jsx-scope': 'off', // Not needed for React Native
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
    'react/prop-types': 'off',
  },
};
