<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link rel="manifest" href="/manifest.json">

    <title>TVON</title>
    @vite('resources/js/app.js')
    @vite('resources/css/app.css')
    @inertiaHead
  </head>
  <body class=" font-sans font max-w-xl mx-auto box-border mb-24 ">
    @inertia
  </body>
</html>