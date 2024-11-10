<?php

namespace App\Http\Controllers;
// use Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;



class SerieController extends Controller
{

    public function getCastBySerie($id, $name)
    {
        $cast = [];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/cast');
        if ($response->successful()) {
            $cast = $response->json();
        }
        return Inertia::render('Series/CastSerieView', [
            'cast' => $cast,
            'name' => $name

        ]);
    }
    public function getSeasonsBySerie($id, $name)
    {
        $seasons = [];

        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/seasons');
        if ($response->successful()) {
            $seasons = $response->json();
        }
        return Inertia::render('Series/SeasonSerieView', [
            'seasons' => $seasons,
            'name' => $name

        ]);
    }
    public function getAllEpisodes($name, $id)
    {
        $episodes = [];
        $cantSeason=[];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/episodes');
        if ($response->successful()) {
            $episodes = $response->json();
            foreach ($episodes as $episode) {
                $seasonId = $episode['season'];
                $seasonNum = $episode['season'];
                // dd($seasonNum);
                
                if (!isset($seasons[$seasonId])) {
                    $seasons[$seasonId] = [];
                    array_push($cantSeason,$seasonId);
                }
                $seasons[$seasonId][] = $episode;


            }
        }

        return Inertia::render('Series/AllEpisodesBySerieView', [
            'seasons' => $seasons,
            'name' => $name,
            'ids'=>array_reverse($cantSeason)

        ]);
    }
    public function getAllImagesBySerie($name, $id)
    {
        // $images = [];
        $posters = [];
        $banners = [];
        $backgrounds = [];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/images');
        if ($response->successful()) {
            $images = $response->json();
            $json = json_decode($response);
            foreach ($json as $image) {
                if ($image->type == 'poster') {
                    array_push($posters, $image);
                }
                if ($image->type == 'banner') {
                    array_push($banners, $image);
                }
                if ($image->type == 'background') {
                    array_push($backgrounds, $image);
                }
            }
        }
        return Inertia::render('Series/GalleryBySerieView', [
            'posters' => $posters,
            'backgrounds' => $backgrounds,
            'banners' => $banners,
            'name' => $name,
            'id' => $id

        ]);
    }
    public function getImageById(Request $request)
    {
        $id = $request->id;
        $idimage = $request->idimage;
        $name = $request->name;
        $foundImage = null;

        $imageUrl = request()->query('imageUrl');
        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/images');
        if ($response->successful()) {
            $images = $response->json();

            array_filter($images, function ($image) use ($idimage, &$foundImage) {
                // var_dump($image['id']==$idimage);
                if ($image['id'] == $idimage) {

                    $foundImage = $image;
                    return true;
                }
                return false;
            });
            // var_dump($foundImage);
        }
        return Inertia::render('Series/SingleImageGalleryView', [
            'imageUrl' => $imageUrl,
            'name' => $name,
            'foundImage' => $foundImage,
            'idimage' => $idimage
        ]);
    }

    public function getEpisodesBySeason($name, $season, $id)
    {
        $episodes = [];
        $response = Http::get("https://api.tvmaze.com/seasons/" . $id . '/episodes');
        if ($response->successful()) {
            $episodes = $response->json();
        }
        return Inertia::render('Series/EpisodesBySeasonView', [
            'episodesBySeason' => $episodes,
            'name' => $name,
            'season' => $season

        ]);
    }
    public function getSerieById($id)
    {
        $serie = [];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id);
        if ($response->successful()) {
            $serie = $response->json();
        }
        return Inertia::render('Series/SingleSerieResultView', [
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
        $seriesArrayLimit = array_slice($seriesArray, 0, 7);
        return Inertia::render('SearchView', [
            'series' => $seriesArrayLimit
        ]);
    }
    public function buscadorUsuarios(Request $request)
    {
        $usersArray = [];
        // ; // Obtener la URL actual
        
        // if ($request->has('name')) {
            
        //     $seriesArray = $this->getSeriesByName($request->input('name'));
            
        // }
        // $seriesArrayLimit = array_slice($seriesArray, 0, 7);
        return Inertia::render('SearchUsersView', [
            'users' => $usersArray
        ]);
    }
    public function buscadorPost(Request $request)
    {
        $seriesArray = [];
        if ($request->has('name')) {
            $seriesArray = $this->getSeriesByName($request->input('name'));
            
        }
        $seriesArrayLimit = array_slice($seriesArray, 0, 4);
        
        // var_dump($seriesArray);
        return Inertia::render('UploadPostView', [
            'series' => $seriesArrayLimit
        ]);
    }

}
