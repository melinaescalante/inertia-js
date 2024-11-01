<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use URL;

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
    public function profile(Request $request)
    {
        $postId = request('id');
       
        return Inertia::render('Profile/ProfileView', ['id' => $postId]);
     
    }
    public function profileEdit()
    {
        return Inertia::render('EditProfileView');
    }
    public function editPhotoProfile(){
        return Inertia::render('Profile/EditPhotoProfileView');

    }
    public function singlePost(Request $request)
    {

        $postId = request('id');
        // echo $postId;
        return Inertia::render('SinglePostView', ['id' => $postId]);
    }
    public function login()
    {
        return Inertia::render('LoginView');
    }
    public function signUp()
    {
        return Inertia::render('SignUpView');
    }
    public function mySeries()
    {
        return Inertia::render('SeriesView');
    }
    public function myWishlist(Request $request)
{
  
    $seriesToWatch = $request->input('seriesToWatch', []);

    // Renderiza la vista con Inertia
    return Inertia::render('WishlistView', [
        'seriesToWatch' => $seriesToWatch
    ]);
}
    public function endedSeries(Request $request)
{
  
    // $seriesToWatch = $request->input('seriesToWatch', []);

    // Renderiza la vista con Inertia
    return Inertia::render('EndedSeriesView', [
        // 'seriesToWatch' => $seriesToWatch
    ]);
}
    public function misSeries()
    {
        return Inertia::render('SeriesView');
    }
    public function configuraciones()
    {
        return Inertia::render('ConfigView');
    }
    public function uploadPost( Request $request)
    {
        return Inertia::render('UploadPostView');
    }

}