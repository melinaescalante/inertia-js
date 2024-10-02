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
    public function profileEdit()
    {        return Inertia::render('EditProfileView');
    }
    public function login()
    {        return Inertia::render('LoginView');
    }
    public function signUp()
    {        return Inertia::render('SignUpView');
    }
    public function mySeries()
    {
        return Inertia::render('SeriesView');
    }
    public function configuraciones()
    {
        return Inertia::render('ConfigView');
    }
    public function uploadPost()
    {
        return Inertia::render('UploadPostView');
    }
    public function uploadPostProcess(Request $request)
    {
        $request->validate(
            [
                'serie' => 'required',
                
            ],
            ['serie.required' => 'Debes ingresar una serie para que los demás sepan de cuál hablas.'],
        );
    }
}