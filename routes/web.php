<?php

use App\Http\Controllers\AppController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SerieController;
use Google\Cloud\Firestore\FirestoreClient;
use Kreait\Laravel\Firebase\Facades\Firebase;

//Rutas de vistas basicas

Route::get('/', [AppController::class,"home"])
->name('home');

Route::get('/chat', [AppController::class,"chat"])
->name('chat');
Route::get('/configuraciones', [AppController::class,"configuraciones"])
->name('config');

Route::get('/perfil/{id}', [AppController::class,"profile"])
->name('profile');

Route::get('/perfil/edit', [AppController::class,"profileEdit"])
->name('profileEdit');

Route::get('/post/{id}', [AppController::class,"singlePost"])
->name('singlePost');

Route::get('/misSeries', [AppController::class,"mySeries"])
->name('mySeries');

Route::get('/descubrir', [AppController::class,"discover"])
->name('discover');

Route::get('/buscador', [SerieController::class, 'buscador']);
//Rutas especificas de series con respecto a peticiones a la api
Route::get('/show/{id}', [SerieController::class, 'getSerieById']);

Route::get('/show/{id}/elenco/{name}', [SerieController::class, 'getCastBySerie']);

Route::get('/show/{id}/temporadas/{name}', [SerieController::class, 'getSeasonsBySerie']);

Route::get('/show/temporadas/episodios/{name}/{id}', [SerieController::class, 'getEpisodesBySeason']);

Route::get('/subirPublicacion', [AppController::class, 'uploadPost']);


//Rutas para registro y autenticacion
Route::get('/ingresar', [AppController::class,"login"])
->name('login');

Route::get('/registrarme', [AppController::class,"signUp"])
->name('signUp');

//Prueba firebase

Route::get('/firebase', function () {

    dd(Firebase::project('TvOn-Escalante')->auth());
    
});
