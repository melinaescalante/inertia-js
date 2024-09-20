<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AppController extends Controller
{
    public function home()
    {
        return Inertia::render('HomeView');
    }

    public function chat()
    {
        return Inertia::render('ChatView');
    }

    public function discover()
    {
        return Inertia::render('DiscoverView');
    }
    public function profile()
    {        return Inertia::render('ProfileView');
    }
    public function mySeries()
    {
        return Inertia::render('SeriesView');
    }
    public function uploadPost()
    {
        return Inertia::render('UploadPostView');
    }
}