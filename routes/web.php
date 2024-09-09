<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SerieController;


Route::get('/', [\App\Http\Controllers\AppController::class,"home"])
->name('home');

Route::get('/chat', [\App\Http\Controllers\AppController::class,"chat"])
->name('chat');

Route::get('/perfil', [\App\Http\Controllers\AppController::class,"profile"])
->name('profile');

Route::get('/misSeries', [\App\Http\Controllers\AppController::class,"mySeries"])
->name('mySeries');

Route::get('/descubrir', [\App\Http\Controllers\AppController::class,"discover"])
->name('discover');

Route::get('/buscador/{name}', [SerieController::class,"getSerie"])
->name('search');
Route::get('/buscador', [SerieController::class,"buscador"]);
