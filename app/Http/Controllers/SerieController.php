<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Stichoza\GoogleTranslate\GoogleTranslate;



class SerieController extends Controller
{
    protected $tr; 

    public function __construct()
    {
        $this->tr = new GoogleTranslate('es');
    }
    public function getEpisode($id)
    {

        $episode = [];
        $response = Http::get("https://api.tvmaze.com/episodes/" . $id);
        if ($response->successful()) {
            $episode = $response->json();
            if (isset($episode['summary'])) {
                $episode['summary'] = $this->tr->translate($episode['summary']);
            }

            if (isset($episode['name'])) {
                $episode['name'] = ucfirst($this->tr->translate($episode['name']));
            }
        }
        // var_dump($episode);
        return Inertia::render('Series/SingleEpisodeView', [
            'episode' => $episode,


        ]);
    }
    public function getCastBySerie($id, $name)
    {
        $cast = [];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/cast');
        if ($response->successful()) {
            $cast = $response->json();
        }
        // var_dump($cast);
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
        $cantSeason = [];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/episodes');
        if ($response->successful()) {
            $episodes = $response->json();
            foreach ($episodes as &$episode) {
                $seasonId = $episode['season'];
                $seasonNum = $episode['season'];
                if (!isset($seasons[$seasonId])) {
                    $seasons[$seasonId] = [];
                    array_push($cantSeason, $seasonId);
                }
                $seasons[$seasonId][] = $episode;

            }
        }

        return Inertia::render('Series/AllEpisodesBySerieView', [
            'seasons' => $seasons,
            'name' => $name,
            'ids' => array_reverse($cantSeason)

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
                if ($image['id'] == $idimage) {

                    $foundImage = $image;
                    return true;
                }
                return false;
            });
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
            $tr = new GoogleTranslate('es');
            if (isset($serie['summary'])) {
                $serie['summary'] = $tr->translate($serie['summary']);
            }
            if (isset($serie['genres'])) {
                $genres = [];
                foreach ($serie['genres'] as $genre) {
                    $genre = ucwords($tr->translate($genre));
                    array_push($genres, $genre);
                }
                $serie['genres'] = $genres;
            }

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


        if ($request->has('name')) {

            $seriesArray = $this->getSeriesByName($request->input('name'));

            $tr = new GoogleTranslate('es');
            foreach ($seriesArray as &$serie) {

                if (isset($serie['show']['genres'])) {
                    $genres = [];
                    foreach ($serie['show']['genres'] as $genre) {

                        $genre = ucwords($tr->translate($genre));
                        array_push($genres, $genre);
                    }

                    $serie['show']['genres'] = $genres;
                }
            }
        }
        $seriesArrayLimit = array_slice($seriesArray, 0, 6);

        return Inertia::render('SearchView', [
            'series' => $seriesArrayLimit
        ]);
    }
    public function buscadorUsuarios(Request $request)
    {
        $usersArray = [];

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

        return Inertia::render('UploadPostView', [
            'series' => $seriesArrayLimit
        ]);
    }

}
