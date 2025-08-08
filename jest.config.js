module.exports = {
   testEnvironment: 'jsdom',
   testMatch: [
      '**/__tests__/**/*.(test|spec).(ts|tsx)',
      '**/*.(test|spec).(ts|tsx)',
   ],
   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
   transform: {
      '^.+\\.(ts|tsx)$': [
         'ts-jest',
         {
            tsconfig: {
               jsx: 'react-jsx',
            },
         },
      ],
   },
   moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
   },
   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
