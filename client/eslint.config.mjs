import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native";
import pluginJest from "eslint-plugin-jest";
import pluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        process: "readonly",
        module: "readonly",
        require: "readonly",
        jest: "readonly",
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
    plugins: {
      react: pluginReact,
      'react-native': pluginReactNative,
      jest: pluginJest,
      import: pluginImport,
    },
    rules: {
      // Warn for unused variables instead of errors
      "no-unused-vars": ["warn", { "varsIgnorePattern": "^_", "ignoreRestSiblings": true }],
      "react/react-in-jsx-scope": "off", // Required for Next.js but not for React Native
      "react/jsx-uses-vars": "error",
      "react/prop-types": "off", // Disable if you're not using PropTypes
      "import/no-unresolved": ["error", { "ignore": ["react-native"] }], // Helps with React Native imports
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      "react-native/no-unused-styles": "warn",
      "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "warn",
      "react-native/no-raw-text": "warn",
    },
  },
];
