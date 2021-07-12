module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "vue/valid-v-slot": ["error", { allowModifiers: true }],
    "vue/no-unused-components":
      process.env.NODE_ENV === "production" ? "error" : "warn",
  },
};
