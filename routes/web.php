<?php

use App\Http\Controllers\AppController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SerieController;


Route::get('/', [AppController::class,"home"])
->name('home');

Route::get('/chat', [AppController::class,"chat"])
->name('chat');
Route::get('/configuraciones', [AppController::class,"configuraciones"])
->name('config');

Route::get('/perfil', [AppController::class,"profile"])
->name('profile');
Route::get('/perfil/edit', [AppController::class,"profileEdit"])
->name('profileEdit');

Route::get('/ingresar', [AppController::class,"login"])
->name('login');

Route::get('/registrarme', [AppController::class,"signUp"])
->name('signUp');

Route::get('/misSeries', [AppController::class,"mySeries"])
->name('mySeries');

Route::get('/descubrir', [AppController::class,"discover"])
->name('discover');


Route::get('/buscador', [SerieController::class, 'buscador']);
Route::get('/subirPublicacion', [AppController::class, 'uploadPost']);

// Route::get('/subirPublicacion', [SerieController::class,"buscadorPost"]);