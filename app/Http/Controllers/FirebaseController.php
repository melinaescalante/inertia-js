<?php

namespace App\Http\Controllers;
// use Illuminate\Support\Facades\Firebase;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Illuminate\Http\Request;

class FirebaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function uniquePost(Request $request){

    }
    public function index()
    {
        $database = Firebase::database();
        $reference = $database->getReference('users');
        $users = $reference->getValue();

        return view('users',
    ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
