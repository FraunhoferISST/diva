module.exports = {
    plugins: ["prettier"],
    extends: ["airbnb-base", "prettier"],
    parserOptions: { ecmaVersion: 2021 },
    rules: {
        "consistent-return": "off",
        "prettier/prettier": ["error"],
        "no-console": 0,
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "class-methods-use-this": "off",
        "no-underscore-dangle": "off",
        "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
    },
};
