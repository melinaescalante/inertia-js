<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;

class FirebaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
     
        $this->app->singleton('firebase',  
function ($app) {
            return (new Factory)->withServiceAccount('firebase.credentials.path');
        });
}


    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
