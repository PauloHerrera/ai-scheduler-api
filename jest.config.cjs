module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^../repositories/doctorRepository$': '<rootDir>/tests/__mocks__/doctorRepository.ts',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true, // Add this
        tsconfig: {
          // We can keep overrides here if needed, but start minimal
          module: 'ESNext', // Keep this for ESM compatibility in tests
          verbatimModuleSyntax: false, // Keep this for CJS/ESM interop issues
        },
      },
    ],
  },
};
