<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\FirebaseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SerieController;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Contract\Firestore;
use Google\Cloud\Firestore\V1\ListDocumentsRequest;

//Rutas de vistas basicas

Route::get('/', [AppController::class,"home"])
->name('home');

Route::get('/chat', [AppController::class,"chat"])
->name('chat');
Route::get('/configuraciones', [AppController::class,"configuraciones"])
->name('config');

Route::get('/perfil/{id}', [AppController::class,"profile"])
->name('profile')
->whereAlphaNumeric('id');

Route::get('/perfilinfo/edit', [AppController::class,"profileEdit"])
->name('profileEdit');

Route::get('/post/{id}', [AppController::class,"singlePost"])
->name('singlePost')
->whereAlphaNumeric('id');

Route::get('/misSeries', [AppController::class,"mySeries"])
->name('mySeries');
//SubViews de las series del usuario
Route::get('/wishlist', [AppController::class,"myWishlist"]);
Route::post('/wishlist', [AppController::class, 'myWishlist']);
Route::get('/descubrir', [AppController::class,"discover"])
->name('discover');

Route::get('/buscador', [SerieController::class, 'buscador']);
//Rutas especificas de series con respecto a peticiones a la api
Route::get('/show/{id}', [SerieController::class, 'getSerieById'])
->whereNumber('id');

Route::get('/show/{id}/elenco/{name}', [SerieController::class, 'getCastBySerie'])
;

Route::get('/show/{id}/temporadas/{name}', [SerieController::class, 'getSeasonsBySerie'])
->whereNumber('id');

Route::get('/show/temporadas/episodios/{name}/{season}/{id}', [SerieController::class, 'getEpisodesBySeason'])
->whereNumber('id');

Route::get('show/{name}/episodios/{id}', [SerieController::class, 'getAllEpisodes'])
->whereNumber('id');

Route::get('show/{name}/galeria/{id}', [SerieController::class, 'getAllImagesBySerie'])
->whereNumber('id');

Route::get('show/{name}/{id}/{idimage}/imagen', [SerieController::class, 'getImageById']);

Route::get('/subirPublicacion', [SerieController::class, 'buscadorPost']);


//Rutas para registro y autenticacion
Route::get('/ingresar', [AppController::class,"login"])
->name('login');

Route::get('/registrarme', [AppController::class,"signUp"])
->name('signUp');
Route::get('/users', [FirebaseController::class,"getUsers"]);

//Prueba firebase

// Route::get('/firebase', function (Firestore $firestore) {

//     // dd(Firebase::project('TvOn-Escalante')->auth());

//     /** @var \Google\Cloud\Firestore\FirestoreClient */
//     $database = $firestore->database();
//     $collections = $database->collections();
//     // dd($database->collections());

//     $postsRef = $database->collection('posts-public');

//     try {
//         // https://firebase-php.readthedocs.io/en/7.15.0/cloud-firestore.html
//         https://pecl.php.net/package/gRPC/1.67.0/windows
//         // https://github.com/GoogleCloudPlatform/php-docs-samples/tree/main/firestore
//         // Push
//         // $document = $postsRef->newDocument();
//         // $document->set([
//         //     'hola' => 'mundo',
//         // ]);
//         // dd($document);

//         // echo "<pre>";
//         // // Leer.
//         $documents = $postsRef->listDocuments();
//         // dd($documents->current());
//         foreach ($documents as $key => $value) {
//             // var_dump($key);
//             var_dump($value);
//             echo "<hr>";
//         }
//         echo "</pre>";
//     } catch (\Throwable $th) {
//         throw $th;
//     }


//     // $request = (new ListDocumentsRequest())
//     //     ->setParent('projects/tvon-escalante/databases/(default)/documents')
//     //     ->setCollectionId('posts-public');

//     // $documents = $database->listDocuments($request);
//     // dd($documents

// });
