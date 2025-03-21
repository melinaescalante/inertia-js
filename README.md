
# TVON
## Creadora: Melina Escalante
<p align="center"><a href="https://tvonlandingpage.netlify.app" target="_blank"><img src="/public/images/ImagotipoEspesorFinalSinApilar.png" width="400" alt="TVON Logo"></a></p>


**[TVON](https://tvonlandingpage.netlify.app/)** está desarrollado y sumamente pensados para aquellas personas fanáticas de las series. Aquellas personas que no coinciden con sus amigos en mirar las series.
**[TVON](https://tvonlandingpage.netlify.app)** es el lugar en donde toda la comunidad se une a debatir, opinar, subir pensamientos, compartir momentos, generar vínculos, y también acompañado de una buena serie.


## ¿En qué lenguaje está desarrolado?

**[TVON](https://tvonlandingpage.netlify.app)** está desarrollado en el framework de javaScript, **[Inertia.js](https://inertiajs.com)**. Utilizando laravel y vue.

### Funcionalidades

- Subir posteos, eliminar posteo, comentar, dar like y compartir.

- Personalizar tu perfil: géneros preferidos,nombre de usuario.
- Seguir a amigos
- Chat en privado.
- Recomendaciones según géneros favoritos
- Buscador de series y usuarios.
- Seguimiento de series: series viendo, vistas y en tu lista.
- Home personalizada en base a series viendo y en tu lista para ver
- Vista de cada serie con información de elenco, galería, episodios totales y sus temporadas.
- Reviews disponibles para cada serie.
- Puntuación de serie al terminarla.

#### ¿Cómo abrirlo?
1. Clonar repositorio dentro de la carpeta xampp/  htdocs

2. Habilitar extension "sodium" en el archivo de php.ini
``` env
extension= sodium
```
3. Descargar extension grpc y colocarla dentro de nuestra carpeta /php/ext, y luego habilitarla
``` env
extension= grpc
```
4. Descargar dependecias de node.js
``` bash
npm i
```
5. Agregar claves a .env

6. En la clave del .env 

``` env
SESSION_DRIVER=file
```

7. Descargar depencias para PHP
``` bash
composer i
```

8. Generar api key de php
``` bash

php artisan key:generate

```

9. Prender de xampp, apache y mysql

10. Levantar servidor de front
``` bash

npm run dev

```
11. Levantar servidor de back
``` bash

php artisan serve

```





