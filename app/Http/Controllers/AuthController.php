<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function setAuth(Request $request)
    {
        $request->session()->put('id', $request->input('id'));

        return response()->json(['status' => 'ok']);
    }

    public function logout(Request $request)
    {
        $request->session()->remove('id');

        return response()->json(['status' => 'ok']);
    }
}
