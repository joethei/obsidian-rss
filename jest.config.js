module.exports = {
    transform: {"\\.ts$": ['ts-jest']},
    collectCoverage: true,
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src", "test"],
    coverageReporters: ["lcov", "text", "teamcity"],
    testResultsProcessor: "jest-teamcity-reporter",
    testMatch: ["**/test/**/*.test.ts"]
};
