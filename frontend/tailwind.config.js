import { colors } from './constants/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				primary: colors.primary,
				secondary: colors.secondary,
				background: colors.background,
				foreground: colors.foreground,
			}
		},
	},
	plugins: [],
};
