export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.\\./)(sourceFiles)\\.js$': '<rootDir>/src/sourceFiles.ts',
    '^(\\./)(sourceFiles)\\.js$': '<rootDir>/src/sourceFiles.ts',
  },
};
