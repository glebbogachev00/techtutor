module.exports = {
  content: [
    './index.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#193b92',
        'primary-light': '#2952b8',
        'primary-dark': '#0f2861',
        teal: {
          DEFAULT: '#2C7A7B',
          light: '#319795',
          dark: '#234E52',
        },
        orange: {
          DEFAULT: '#193b92',
          light: '#2952b8',
        },
        ink: '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
