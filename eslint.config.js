import pluginJs from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import securityPlugin from "eslint-plugin-security";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";
import tsPlugin from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
    // Security
    securityPlugin.configs.recommended,
    {
        files: ["**/*.ts"]
    },
    {
        languageOptions: { globals: globals.node }
    },
    {
        rules: {
            "func-style": ["error", "expression"],
            "no-restricted-syntax": ["off", "ForOfStatement"],
            "prefer-template": "error",
            quotes: ["error", "double", { avoidEscape: true }]
        }
    },
    // TypeScript Eslint
    {
        rules: {
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/consistent-type-definitions": ["error", "type"]
        }
    },
    // Prettier
    {
        plugins: {
            prettier
        },
        rules: {
            "prettier/prettier": [
                1,
                {
                    endOfLine: "lf",
                    printWidth: 100,
                    semi: true,
                    singleQuote: false,
                    tabWidth: 4,
                    trailingComma: "none",
                    useTabs: false
                }
            ]
        }
    },
    // Unicorn
    {
        plugins: {
            unicorn: unicornPlugin
        },
        rules: {
            "unicorn/empty-brace-spaces": "off",
            "unicorn/no-null": "off"
        }
    },
    pluginJs.configs.recommended,
    ...tsPlugin.configs.recommended
];
