/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    // Ajustement des chemins pour la nouvelle structure
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Si vous utilisez le dossier pages
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Pour l'App Router
    './lib/**/*.{js,ts,jsx,tsx,mdx}', // Inclure lib si des classes y sont utilisées
  ],
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
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'400': '#818cf8',
  				'600': '#4f46e5',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				light: '#FFD5D5',
  				dark: '#FF9595'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  				light: '#C5EBEB',
  				dark: '#89D5D5'
  			},
  			pastel: {
  				pink: {
  					'50': '#FFF0F0',
  					'100': '#FFE1E1',
  					'200': '#FFB5B5',
  					'300': '#FF9B9B',
  					'400': '#FF8080',
  					'500': '#FF6666'
  				},
  				blue: {
  					'50': '#F0F9F9',
  					'100': '#E1F4F4',
  					'200': '#A7E0E0',
  					'300': '#8CD6D6',
  					'400': '#71CCCC',
  					'500': '#56C2C2'
  				}
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			pastry: {
  				'50': '#FFF5F5',
  				'100': '#FFE6E6',
  				'200': '#FFC7C7',
  				'300': '#FFA8A8',
  				'400': '#FF8989',
  				'500': '#FF6B6B',
  				'600': '#FF4D4D',
  				'700': '#FF2E2E',
  				'800': '#FF1010',
  				'900': '#F10000'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			   "fade-in": "fadeIn 0.4s ease-in-out", // Ajout de l'animation fade-in
  		}
  	},
  		keyframes: { // Assurez-vous que keyframes est au même niveau que animation
  			 'accordion-down': {
  			   from: { height: '0' },
  			   to: { height: 'var(--radix-accordion-content-height)' },
  			 },
  			 'accordion-up': {
  			   from: { height: 'var(--radix-accordion-content-height)' },
  			   to: { height: '0' },
  			 },
  			 fadeIn: { // Ajout des keyframes pour fadeIn
  			   "0%": { opacity: 0, transform: "translateY(10px)" }, // Légère translation Y
  			   "100%": { opacity: 1, transform: "translateY(0)" },
  			 },
  		},
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")], // Ajouter le plugin typography
}