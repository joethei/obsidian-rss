module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    rules: {
        "@typescript-eslint/no-unused-vars": [
            2,
            { args: "all", argsIgnorePattern: "^_" },
        ],
        "no-useless-escape": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
    },
};
