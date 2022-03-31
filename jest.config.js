module.exports = {
    transform: {"\\.ts$": ['ts-jest']},
    collectCoverage: true,
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src", "test"],

};
