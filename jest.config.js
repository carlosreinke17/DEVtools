module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["<rootDir>/tests/**/*.test.ts?(x)"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  collectCoverageFrom: [
    "src/shared/theme/**/*.{ts,tsx}",
    "src/features/**/*.{ts,tsx}",
  ],
};
