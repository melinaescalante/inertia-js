<?php

namespace App\Http\Controllers;
// use Illuminate\Support\Facades\Firebase;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Illuminate\Http\Request;
use Google\Cloud\Firestore\FirestoreClient;

class FirebaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $firestore;

    public function __construct(FirestoreClient $firestore)
    {
        $this->firestore = $firestore;
    }
    public function getUsers()
    {
        // Referencia a la colección 'users'
        $collection = $this->firestore->collection('users');
        
        // Obtener todos los documentos en la colección
        $documents = $collection->documents();

        // Crear un array para almacenar los datos
        $users = [];

        foreach ($documents as $document) {
            if ($document->exists()) {
                // Agregar los datos del documento al array
                $users[] = $document->data();
            } else {
                echo 'El documento no existe.' . PHP_EOL;
            }
        }

        // Retornar la lista de usuarios o lo que prefieras
        var_dump( response()->json($users));
    }

    public function uniquePost(Request $request){

    }
  

    public function index()
    {
        $database = Firebase::database();
        $reference = $database->getReference('users');
        $users = $reference->getValue();

        return view('users',
    ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
