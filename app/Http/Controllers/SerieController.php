<?php

namespace App\Http\Controllers;
// use Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class SerieController extends Controller
{

    // public function getSerie(Request $name)
    // {
    //     $response = Http::get("https://api.tvmaze.com/search/shows?q={$name}");

    //     if (!$response) {
    //         return response()->json([]); // Si no hay término de búsqueda, devuelve un array vacío
    //     }
    //     if ($response->successful()) {

    //         $series = $response->json();

    //         return response()->json($series);
    //         // return Inertia::render('Pages/ViewSearch', [
    //         //     'series' => $series
    //         // ]);


    //     }

    // }
    public function index(Request $request)
    {

            if ($request->has('name') && $request->name) {
                $response = Http::get("https://api.tvmaze.com/search/shows?q={$request->name}");
    
                if ($response->successful()) {
                    return response()->json([
                        'series' => $response->json()
                    ]);
                }
            
    
        } else {
            // Renderiza la vista para solicitudes no AJAX
            return Inertia::render('Pages/ViewSearch', [
                'series' => []
            ]);
        }
    }
    


    public function buscador()
    {
        return Inertia::render('ViewSearch');
    }
}
