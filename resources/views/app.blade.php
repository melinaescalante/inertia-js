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

<body class=" font-fredoka font-light max-w-xl mx-auto box-border mb-24 " data-csrf="{{ csrf_token() }}">
  
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

</body>

</html>