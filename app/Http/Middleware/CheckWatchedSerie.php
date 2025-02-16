<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckWatchedSerie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user_id= $request->session()->get('id');
        $serieId = $request->route('id');
        $seriesWatched=$request->session()->get('series');
      
        $filteredResult = array_filter($seriesWatched, function($show) use ($serieId) {

            return $show['idSerie'] === intval($serieId);
        });
    
        
        if (!$filteredResult) {
            return to_route('mySeries');

        }
        return $next($request);
    }
}
