<?php

namespace App\Http\Controllers;
// use Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Google\Cloud\Firestore\FirestoreClient;

/**
 * Initialize Cloud Firestore with default project ID.
 */
function setup_client_create(string $projectId = null)
{
    // Create the Cloud Firestore client
    if (empty($projectId)) {
        // The `projectId` parameter is optional and represents which project the
        // client will act on behalf of. If not supplied, the client falls back to
        // the default project inferred from the environment.
        $db = new FirestoreClient();
        printf('Created Cloud Firestore client with default project ID.' . PHP_EOL);
    } else {
        $db = new FirestoreClient([
            'projectId' => $projectId,
        ]);
        printf('Created Cloud Firestore client with project ID: %s' . PHP_EOL, $projectId);
    }
}
class SerieController extends Controller
{
    // public function getSugerencesByGenres()
    // {
    // }
    public function getCastBySerie($id, $name)
    {
        $cast = [];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/cast');
        if ($response->successful()) {
            $cast = $response->json();
        }
        return Inertia::render('CastSerieView', [
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
        return Inertia::render('SeasonSerieView', [
            'seasons' => $seasons,
            'name' => $name

        ]);
    }
    public function getAllEpisodes($name, $id)
    {
        $episodes = [];
        $response = Http::get("https://api.tvmaze.com/shows/" . $id . '/episodes');
        if ($response->successful()) {
            $episodes = $response->json();
            foreach ($episodes as $episode) {
                $seasonId = $episode['season'];

                if (!isset($seasons[$seasonId])) {
                    $seasons[$seasonId] = [];
                }
                $seasons[$seasonId][] = $episode;


            }
        }

        return Inertia::render('AllEpisodesBySerieView', [
            'seasons' => $seasons,
            'name' => $name

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
        return Inertia::render('GalleryBySerieView', [
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
        return Inertia::render('SingleImageGalleryView', [
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
        return Inertia::render('EpisodesBySeasonView', [
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
