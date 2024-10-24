<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;
use Google\Cloud\Firestore\FirestoreClient;

class FirebaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
        $this->app->singleton(FirestoreClient::class, function ($app) {
            // Opcionalmente, puedes obtener el `projectId` desde el archivo de configuración .env
            $projectId = config('services.firestore.project_id');
            
            return new FirestoreClient([
                'projectId' => $projectId,
            ]);
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
