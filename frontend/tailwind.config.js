// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary green color scheme
        'primary': {
          DEFAULT: '#26d935',
          '50': '#e8fcea',
          '100': '#c7f7cc',
          '200': '#a3f2ab',
          '300': '#7fed8a',
          '400': '#5be96f',
          '500': '#26d935',
          '600': '#1fc52d',
          '700': '#18a624',
          '800': '#12871c',
          '900': '#0a5e10',
          'dark': '#18a624',
        },
        'success': '#1cc88a',
        'info': '#36b9cc',
        'warning': '#f6c23e',
        'danger': '#e74a3b',
        'dark': '#1a202c',
        'light': '#f8f9fa',
        'gray': {
          '100': '#f8f9fc',
          '600': '#6c757d',
          '800': '#5a6169',
        },
        'brand-green': '#26d935',
        'brand-dark': '#193d33',
      },
      fontFamily: {
        'sans': ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
        'soft-xxl': '0 0.3125rem 0.625rem 0 rgba(0, 0, 0, 0.12)',
        'soft-lg': '0 10px 20px rgba(0, 0, 0, 0.03), 0 6px 6px rgba(0, 0, 0, 0.02)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}