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

<div id="google_translate_element" class="hidden">

<div class="skiptranslate goog-te-gadget" dir="ltr" style="">
  <div id=":0.targetLanguage"><select class="goog-te-combo" aria-label="Widget de idiomas del Traductor">
      <option value="es" selected>español</option>
      
    </select></div>
</div>
</div>

  @inertia
  <!-- <script>
    window.gtranslateSettings = window.gtranslateSettings || {};
    window.gtranslateSettings['43217984'] = {
      "default_language": "en",
      "languages": ["es"],
      "wrapper_selector": "#gt-mordadam-43217984",
      "native_language_names": 1,
      "flag_style": "2d",
      "flag_size": 24,
      "horizontal_position": "inline",
      "flags_location": "/flags\/"
      };
    </script>
    <script src="/lang/gt.js" data-gt-widget-id="43217984"></script>
    <script type="text/javascript">
      if (typeof window.GTranslateWidget === 'function') {
        window.GTranslateWidget();
        }
      </script> -->
  <!-- <div id="google_translate_element"></div> -->


  <script>
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
    }
  </script>
  <script async defer src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

</body>

</html>