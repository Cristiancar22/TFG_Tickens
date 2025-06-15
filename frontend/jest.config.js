module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo-modules-core|expo|expo-.*|@expo/.*)',
    ],
    testMatch: [
        '**/__tests__/**/*.test.js?(x)',
        '**/?(*.)+(spec|test).js?(x)',
        '**/*.test.ts?(x)',
        '**/*.spec.ts?(x)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^react-native-svg$': 'react-native-svg-mock',
    },
};
