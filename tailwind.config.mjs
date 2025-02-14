/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			keyframes: {
				appear: {
					'0%': { opacity: 0, transform: 'translateY(10px)' },
					'100%': { opacity: 1, transform: 'none' },
				},
			},
			animation: {
				appear: 'appear 0.6s both calc(var(--stagger, 0) * 120ms)',
			},
			maxWidth: {
				container: '43rem',
			},
			fontSize: {
				'2xs': '0.5rem',
				'3xs': '0.25rem',
			},
		},
	},
	safelist: ['sr-only'],
	plugins: [],
};
