/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "next/core-web-vitals",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-empty-interface": "off",
  },
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      rules: {
        "@typescript-eslint/no-misused-promises": "off",
      },
    },
  ],
  root: true,
};

module.exports = config;
