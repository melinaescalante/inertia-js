<?php

namespace App\Http\Controllers;
// use Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
class SerieController extends Controller
{

    public function getCastBySerie($id, $name)
    {
        $cast = [];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/cast');
        if ($response->successful()) {
            $cast = $response->json();
        }
        return Inertia::render('CastSerieView', [
            'cast' => $cast,
            'name'=>$name
            
        ]);
    }
    public function getSeasonsBySerie($id, $name){
        $seasons = [];

        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/seasons');
        if ($response->successful()) {
            $seasons = $response->json();
        }
        return Inertia::render('SeasonSerieView', [
            'seasons' => $seasons,
            'name'=>$name
            
        ]);
    }
    public function getEpisodesBySeason($id, $name)
    {
        $episodes = [];
        $response = Http::get("https://api.tvmaze.com/seasons/". $id .'/episodes');
        if ($response->successful()) {
            $episodes = $response->json();
            var_dump($episodes);
        }
        return Inertia::render('EpisodesBySeasonView', [
            'episodesBySeason' => $episodes,
            'name'=>$name
            
        ]);
    }
    public function getSerieById($id)
    {
        $serie = [];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id);
        if ($response->successful()) {
            $serie = $response->json();
        }
        return Inertia::render('SingleSerieResultView', [
            'serie' => $serie
        ]);
    }
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
