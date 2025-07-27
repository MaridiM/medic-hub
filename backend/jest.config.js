/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // для @/*
    '^@prisma/__generated__$': '<rootDir>/prisma/__generated__', // строгое сопоставление
    '^@prisma/__generated__/(.*)$': '<rootDir>/prisma/__generated__/$1', // путь до файла
  }
}
