/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.js", "!**/sendmail.test.js"],
  modulePaths: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { configFile: "./babel.config.js" }],
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@utils/(.*)$": "<rootDir>/Server/utils/$1",
    "^@services/(.*)$": "<rootDir>/Server/services/$1",
    "^@models/(.*)$": "<rootDir>/Server/models/$1",
    "^@controllers/(.*)$": "<rootDir>/Server/controllers/$1",
  },
};

export default config;
