<?php

namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
       
    }


    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // Inertia::share('currentComponent', function () {
        //     return request()->route()?->getName(); // Devuelve el nombre de la ruta (que generalmente coincide con el componente)
        // });
    }
}
