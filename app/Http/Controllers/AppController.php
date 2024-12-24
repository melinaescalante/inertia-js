<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Stichoza\GoogleTranslate\GoogleTranslate;


class AppController extends Controller
{
    public function home()
    {
       
        return Inertia::render('HomeView');
    }
    public function following()
    {
       
        return Inertia::render('HomeFollowingView');
    }


    public function chat()
    {
        return Inertia::render('Profile/ChatView');
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
    public function myProfile(Request $request)
    {
        // $postId = request('id');

        return Inertia::render('Profile/ProfileAuthView');

    }
    public function chatPrivate($id, $email)
    {

        return Inertia::render('Profile/ChatPrivateView', [
            'id' => $id,
            'email' => $email,
        ]);

    }

    public function profileEdit()
    {
        return Inertia::render('Profile/EditProfileView');
    }
    public function editPhotoProfile()
    {
        return Inertia::render('Profile/EditPhotoProfileView');

    }
    public function singlePost(Request $request)
    {

        $postId = request('id');

        return Inertia::render('SinglePostView', ['id' => $postId]);
    }
    public function login()
    {
        return Inertia::render('Profile/Auth/LoginView');
    }
    public function signUp()
    {
        return Inertia::render('Profile/Auth/SignUpView');
    }
    public function mySeries()
    {
        return Inertia::render('SeriesView');
    }
    public function myWishlist(Request $request)
    {

        return Inertia::render('WishlistView');
    }
    public function endedSeries()
    {

        return Inertia::render('EndedSeriesView');
    }
    public function misSeries()
    {
        return Inertia::render('SeriesView');
    }
    public function configuraciones()
    {
        return Inertia::render('ConfigView');
    }
    public function uploadPost(Request $request)
    {
        return Inertia::render('UploadPostView');
    }

}
