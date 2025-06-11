
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'rgb(200 200 200)',
				input: 'rgb(255 255 255)',
				ring: 'rgb(0 0 0)',
				background: 'rgb(255 255 255)',
				foreground: 'rgb(0 0 0)',
				primary: {
					DEFAULT: 'rgb(0 0 0)',
					foreground: 'rgb(255 255 255)'
				},
				secondary: {
					DEFAULT: 'rgb(245 245 245)',
					foreground: 'rgb(0 0 0)'
				},
				accent: {
					DEFAULT: 'rgb(0 0 0)',
					foreground: 'rgb(255 255 255)'
				},
				muted: {
					DEFAULT: 'rgb(245 245 245)',
					foreground: 'rgb(60 60 60)'
				},
				destructive: {
					DEFAULT: 'rgb(220 38 38)',
					foreground: 'rgb(255 255 255)'
				},
				popover: {
					DEFAULT: 'rgb(255 255 255)',
					foreground: 'rgb(0 0 0)'
				},
				card: {
					DEFAULT: 'rgb(255 255 255)',
					foreground: 'rgb(0 0 0)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				serif: ['Playfair Display', 'Georgia', 'serif'],
				sans: ['Inter', 'system-ui', 'sans-serif']
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.7s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'shimmer': 'shimmer 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
