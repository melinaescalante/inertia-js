/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Incluimos el archivo del index (nuestro "entry point").
    "./resources/views/app.blade.php",
    // Incluimos todos los archivos que tengan como extensión vue, js, jsx,
    // ts o tsx, sin importar su nombre (*.{vue,js,jsx,ts,tsx}), que estén
    // en la carpeta "src/" (./src/) o en cualquiera de sus subcarpetas
    // (**/).
    "./resources/**/*.{vue,js,jsx,ts,tsx,php}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          0: '#ffcc99',
          1000: '#ff9933',
        },
        blue: {
          0: '#99ccff',
          1000: '#333399',
        },
      },
    },

  },
  plugins: [],
}

