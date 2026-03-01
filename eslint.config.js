import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  globalIgnores(["dist", ".vite", ".vite/**", "node_modules"]),

  {
    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    extends: [
      js.configs.recommended,
      importPlugin.flatConfigs.recommended,
      react.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactHooks.configs.flat.recommended,
      prettier, // MUST be last
    ],

    rules: {
      // React 17+ JSX runtime
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // Vite Fast Refresh safety
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "import/extensions": ["error", "always", { ignorePackages: true }],
      "import/no-unresolved": "off",
    },
  },
]);
