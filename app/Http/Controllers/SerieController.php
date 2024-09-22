<?php

namespace App\Http\Controllers;
// use Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class SerieController extends Controller
{

    
public function getSeriesByName($name)
{
    $response = Http::get("https://api.tvmaze.com/search/shows?q=" . $name);

    if ($response->successful()) {
        return $response->json();
    } else {
        return [];
    }
}

public function buscador(Request $request)
{
    $seriesArray = [];
    
    if ($request->has('name')) {
        // echo $request->has('name');
        $seriesArray = $this->getSeriesByName($request->input('name'));
        // var_dump($seriesArray);
    }

    return Inertia::render('ViewSearch', [
        'series' => $seriesArray
    ]);
}

}
