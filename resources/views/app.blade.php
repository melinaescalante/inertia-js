<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" type="image/png" href="/favicon.ico" >
  <title>TVON</title>
  @vite('resources/js/app.js')
  @vite('resources/css/app.css')
  @inertiaHead
</head>
<body class=" font-fredoka font-light max-w-2xl mx-auto box-border" data-csrf="{{ csrf_token() }}">
  <div id="google_translate_element" style="display:none "></div>
  @inertia
  <!-- Scripts relacionados con Google Translate -->
  <script>
    function googleTranslateElementInit() {
      new google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
    }
  </script>
  <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

  <script>
    function setGoogleTranslateLanguage(lang) {
      var combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change')); 
      }
    }

    // Esperar que la API se cargue y cambiar el idioma
    setTimeout(() => {
      setGoogleTranslateLanguage('es'); // Cambiar a inglés automáticamente
    }, 2000); // Ajusta el tiempo si es necesario
  </script>

</body>

</html>