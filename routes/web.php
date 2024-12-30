<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SerieController;
use App\Http\Middleware\CheckAuthSession;

//Rutas de vistas basicas

Route::get('/', [AppController::class, "home"])
    ->name('home');
Route::get('/siguiendo', [AppController::class, "homeFollowing"])
    ->name('homeFollowing');

Route::get('/chatPrivado/{id}/{email}', [AppController::class, "chatPrivate"])
    ->middleware(CheckAuthSession::class);

Route::get('/chat', [AppController::class, "chat"])
    ->middleware(CheckAuthSession::class);

Route::post('/{username}/seguidos', [AppController::class, "following"])
    ->whereAlphaNumeric('username')->middleware(CheckAuthSession::class);
Route::get('/{username}/seguidos', [AppController::class, "following"])
    ->whereAlphaNumeric('username')->middleware(CheckAuthSession::class);

Route::get('/configuraciones', [AppController::class, "configuraciones"])
    ->name('config');

Route::get('/perfil/{id}', [AppController::class, "profile"])
    ->name('profile')
    ->whereAlphaNumeric('id');

Route::get('/miPerfil', [AppController::class, "myProfile"])
    ->name('myProfile')
    ->middleware(CheckAuthSession::class);

Route::get('/perfilinfo/edit', [AppController::class, "profileEdit"])
    ->name('profileEdit')
    ->middleware(CheckAuthSession::class);

Route::get('/editFotoPerfil', [AppController::class, "editPhotoProfile"])
;

Route::get('/post/{id}', [AppController::class, "singlePost"])
    ->name('singlePost')
    ->whereAlphaNumeric('id');

Route::get('/misSeries', [AppController::class, "mySeries"])
    ->name('mySeries')
    ->middleware(CheckAuthSession::class);

Route::get('/descubrir', [AppController::class, "discover"])
    ->name('discover');

Route::get('/buscador', [SerieController::class, 'buscador']);

Route::get('/buscadorUsuarios', [SerieController::class, 'buscadorUsuarios']);

//SubViews de las series del usuario
Route::get('/wishlist', [AppController::class, "myWishlist"])
    ->middleware(CheckAuthSession::class);

Route::get('/seriesVistas', [AppController::class, "endedSeries"])
    ->middleware(CheckAuthSession::class);

//Rutas especificas de series con respecto a peticiones a la api
Route::get('/show/{id}', [SerieController::class, 'getSerieById'])
    ->whereNumber('id');

Route::get('/show/{id}/elenco/{name}', [SerieController::class, 'getCastBySerie'])
;
Route::get('/show/episode/{id}', [SerieController::class, 'getEpisode'])
;

Route::get('/show/{id}/temporadas/{name}', [SerieController::class, 'getSeasonsBySerie'])
    ->whereNumber('id');

Route::get('/show/temporadas/episodios/{name}/{season}/{id}', [SerieController::class, 'getEpisodesBySeason'])
    ->whereNumber('id')->name('episodesBySeason');

Route::get('show/{name}/episodios/{id}', [SerieController::class, 'getAllEpisodes'])
    ->whereNumber('id');

Route::get('show/{name}/galeria/{id}', [SerieController::class, 'getAllImagesBySerie'])
    ->whereNumber('id');

Route::get('show/{name}/{id}/{idimage}/imagen', [SerieController::class, 'getImageById']);

Route::get('/subirPublicacion', [SerieController::class, 'buscadorPost'])
    ->middleware(CheckAuthSession::class);


//Rutas para registro y autenticacion
Route::get('/ingresar', [AppController::class, "login"])
    ->name('login');

Route::get('/registrarme', [AppController::class, "signUp"])
    ->name('signUp');

Route::post('/asignarAuth', [AuthController::class, 'setAuth']);

Route::post('/cerrarSesion', [AuthController::class, 'logout']);
