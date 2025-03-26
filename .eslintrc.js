module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['react', '@typescript-eslint'],
	rules: {
		// Buenas prácticas generales
		'no-console': 'warn',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ argsIgnorePattern: '^_' },
		],
		'no-debugger': 'error',
		eqeqeq: ['error', 'always'],
		'no-var': 'error',
		'prefer-const': 'error',

		// Estilo y legibilidad
		semi: 'off',
		quotes: 'off',
		indent: 'off',
		'comma-dangle': 'off',
		'object-curly-spacing': ['error', 'always'],
		'arrow-body-style': ['error', 'as-needed'],
		'no-multi-spaces': 'error',
		'max-len': ['warn', { code: 150 }],

		// Reglas de React modernas
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'react/jsx-uses-react': 'off',
		'react/jsx-boolean-value': ['error', 'never'],
		'react/self-closing-comp': 'error',

		// TypeScript
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/ban-ts-comment': [
			'warn',
			{ 'ts-ignore': 'allow-with-description' },
		],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
