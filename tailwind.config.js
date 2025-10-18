/** @type {import('tailwindcss').Config} */
<<<<<<< HEAD
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'toyota-red': '#EB0A1E',
        'toyota-black': '#000000',
        'toyota-white': '#FFFFFF',
        'toyota-gray': '#E5E5E5',
      },
      fontFamily: {
        'toyota': ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
=======
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--accent)",
        background: "var(--bg)",
        foreground: "var(--text)",
        primary: {
          DEFAULT: "var(--accent)",
          foreground: "white",
        },
        secondary: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(210 40% 98%)",
        },
        muted: {
          DEFAULT: "var(--surface)",
          foreground: "var(--muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "white",
        },
        popover: {
          DEFAULT: "var(--card)",
          foreground: "var(--text)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--text)",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "calc(var(--radius) - 2px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      boxShadow: {
        'custom': 'var(--shadow)',
        'custom-lg': 'var(--shadow-lg)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(24px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
>>>>>>> 11dcf3b (Initial commit: MyToyota Smart Match prototype with premium UI)
