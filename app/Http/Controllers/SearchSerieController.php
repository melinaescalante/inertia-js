<?php

namespace App\Http\Controllers;
// use Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class SearchSerieController extends Controller
{

    public function getSerieByName($name)
    {
        $response = Http::get("https://api.tvmaze.com/singlesearch/shows?q={$name}");

        // Verifica si la solicitud fue exitosa
        if ($response->successful()) {
            // Obtén los datos de la API como un array asociativo
            $series = $response->json();
            dd($series);
            // Renderiza el componente de Inertia y pasa los datos de la serie
            return Inertia::render('Pages/View', [
                'series' => $series
            ]);

        }

    }
}
