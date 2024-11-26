<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="manifest" href="/manifest.json">

  <title>TVON</title>
  @vite('resources/js/app.js')
  @vite('resources/css/app.css')
  @inertiaHead
</head>

<body class=" font-fredoka font-light max-w-xl mx-auto box-border mb-28  " data-csrf="{{ csrf_token() }}">

  <!-- <div id="google_translate_element" class="hidden ">

    <div class="skiptranslate goog-te-gadget" dir="ltr" style="">
      <div id=":0.targetLanguage"><select class="goog-te-combo" aria-label="Widget de idiomas del Traductor">
          <option value="es" selected>español</option>

        </select></div>
    </div>
  </div> -->

  @inertia


  <!-- Contenedor oculto del widget de Google Translate -->
  <div id="google_translate_element" style="display: none;"></div>

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

  <!-- Tu script para forzar el cambio de idioma -->
  <script>
    function setGoogleTranslateLanguage(lang) {
      var combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = lang; // Establece el idioma deseado (por ejemplo, 'en' para inglés)
        combo.dispatchEvent(new Event('change')); // Simula el cambio del idioma
      }
    }

    // Esperar que la API se cargue y cambiar el idioma
    setTimeout(() => {
      setGoogleTranslateLanguage('es'); // Cambiar a inglés automáticamente
    }, 500); // Ajusta el tiempo si es necesario
  </script>
  <!-- 
  <script>
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({ pageLanguage: 'en',autoDisplay: false, }, 'google_translate_element');
    }
  </script>
  <script async defer src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script> -->

</body>

</html>