export default {
  testEnvironment: "node",

  testMatch: ["**/test/**/*.test.js", "**/tests/**/*.test.js"],

  transform: {},

  clearMocks: true,

  collectCoverageFrom: [
    "controllers/**/*.js",
    "middlewares/**/*.js",
    "services/**/*.js",
  ],

  coveragePathIgnorePatterns: ["/node_modules/"],
};
