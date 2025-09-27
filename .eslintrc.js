module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
