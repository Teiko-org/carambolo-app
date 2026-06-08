import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        __DEV__: "readonly",
      },
    },
  },
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "19.1.0",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "object-curly-spacing": ["error", "always"],
    },
  },
]);
