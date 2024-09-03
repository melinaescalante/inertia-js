<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return inertia::render('HomeView');
});
Route::get('/chat', function () {
    return inertia::render('ChatView');
});
Route::get('/descubrir', function () {
    return inertia::render('DiscoverView');
});
Route::get('/perfil', function () {
    return inertia::render('ProfileView');
});
Route::get('/miseries', function () {
    return inertia::render('SeriesView');
});
