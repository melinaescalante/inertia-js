<?php

namespace App\Http\Controllers;
// use Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class SerieController extends Controller
{

    public function getSerie($name)
    {
        $response = Http::get("https://api.tvmaze.com/search/shows?q={$name}");
        if ($response->successful()) {
     
            $series = $response->json();
            dd($series);

            return Inertia::render('Pages/SeriesView', [
                'series' => $series
            ]);

        }

    }
    public function buscador()
    {        
        return Inertia::render('SeriesView');
    }
}
