/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Incluimos el archivo del index (nuestro "entry point").
    "./resources/views/app.blade.php",
   
    "./resources/**/*.{vue,js,jsx,ts,tsx,php}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'], // Agrega la fuente Fredoka
      },
      colors: {
        orange: {
          0: '#ffcc99',
          1000: '#ff9933',
        },
        blue: {
          0: '#99ccff',
          1000: '#003399',
        },
      },
    },

  },
  plugins: [],
}

