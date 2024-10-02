<?php

namespace App\Http\Controllers;
// use Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
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
        // ; // Obtener la URL actual

        if ($request->has('name')) {
      
            $seriesArray = $this->getSeriesByName($request->input('name'));
  
        }
        return Inertia::render('SearchView', [
            'series' => $seriesArray
        ]);
    }
    public function buscadorPost(Request $request)
    {
        $seriesArray = [];
        if ($request->has('name')) {
            $seriesArray = $this->getSeriesByName($request->input('name'));

        }
        $seriesArrayLimit = array_slice($seriesArray, 0, 4);
       
        return Inertia::render('UploadPostView', [
            'series' => $seriesArrayLimit
        ]);
    }

}
