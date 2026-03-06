<?php

namespace App\Http\Controllers;

use App\Models\Coleccion;
use Illuminate\Http\Request;

class ColeccionController extends Controller
{
    //obtener todas las cartas de la colección
    public function index()
    {
        return response()->json(Coleccion::all());
    }

    //añadir una carta a la colección
    public function store(Request $request)
    {
        $carta = Coleccion::create([
            'carta_id'=> $request->carta_id,
            'nombre'=> $request->nombre,
            'imagen'=> $request->imagen,
            'precio'=> $request->precio,
        ]);

        return response()->json($carta, 201);
    }

    //eliminar una carta de la colección
    public function destroy($id)
    {
        Coleccion::where('carta_id', $id)->delete();
        return response()->json(['mensaje' => 'Carta eliminada']);
    }
}