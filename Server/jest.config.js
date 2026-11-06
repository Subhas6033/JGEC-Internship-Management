export default {
  testEnvironment: "node",

  rootDir: "/home/developersubhas/Desktop/JGEC-Internship-Management",

  testMatch: ["../test/**/*.test.js", "test/**/*.test.js"],

  transform: {},

  clearMocks: true,

  collectCoverageFrom: [
    "controllers/**/*.js",
    "middlewares/**/*.js",
    "services/**/*.js",
  ],

  coveragePathIgnorePatterns: ["/node_modules/"],

  testPathIgnorePatterns: [
    "<rootDir>/Desktop",
    "<rootDir>/snap",
    "<rootDir>/.claude",
    "<rootDir>/.vscode",
    "<rootDir>/.bun",
    "<rootDir>/.codex",
    "<rootDir>/.nvm",
  ],
};
