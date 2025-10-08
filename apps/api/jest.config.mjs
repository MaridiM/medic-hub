export default {
	moduleFileExtensions: ['js', 'json', 'ts', 'tsx'], // ✅ Added 'tsx'
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	testPathIgnorePatterns: ['/node_modules/', '/dist/', 'src/core/i18n/test/'],
	transform: {
		'^.+\\.(t|j)sx?$': [
			// ✅ Changed to handle tsx/jsx
			'ts-jest',
			{
				tsconfig: {
					allowJs: true,
					esModuleInterop: true,
				},
			},
		],
	},
	transformIgnorePatterns: ['node_modules/(?!(@prisma)/)'],
	collectCoverageFrom: ['**/*.(t|j)s', '!**/*.spec.ts', '!**/*.module.ts', '!**/index.ts', '!**/__generated__/**'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
		'^@prisma/__generated__$': '<rootDir>/../prisma/__generated__',
		'^@prisma/__generated__/(.*)$': '<rootDir>/../prisma/__generated__/$1',
	},
	maxWorkers: '50%',
	testTimeout: 10000,
	modulePathIgnorePatterns: ['<rootDir>/../prisma/__generated__/.*\\.js$'],
}
