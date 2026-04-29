<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Coleccion;

class ColeccionController extends Controller
{

    public function store(Request $request)
    {
        try {
            // Validamos que lleguen los datos
            $request->validate([
                'id' => 'required',
                'name' => 'required'
            ]);

            // Guardamos en la base de datos
            $nuevaCarta = Coleccion::create([
                'carta_id' => $request->id,
                'nombre'   => $request->name,
                'imagen'   => $request->imagen,
                'precio'   => $request->precio_final ?? 0
            ]);

            return response()->json($nuevaCarta, 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al guardar en BD',
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }

    // Listar favoritos (GET)
    public function index()
    {
        return response()->json(Coleccion::all());
    }

    // Eliminar favorito (DELETE)
    public function destroy($id)
    {
        $carta = Coleccion::find($id);
        if ($carta) {
            $carta->delete();
            return response()->json(['message' => 'Carta eliminada']);
        }
        return response()->json(['message' => 'No encontrada'], 404);
    }



    public function getTopMarket()
    {
        try {
            $response = Http::timeout(20)
                ->get('https://api.pokemontcg.io/v2/cards', [
                    'pageSize' => 50,
                    'orderBy'  => '-cardmarket.prices.averageSellPrice',
                    'select'   => 'id,name,images,cardmarket',
                ]);

            if ($response->successful()) {
                $cartas = collect($response->json('data', []));

                $top10 = $cartas
                    ->map(function ($carta) {
                        $precio = $carta['cardmarket']['prices']['averageSellPrice']
                            ?? $carta['cardmarket']['prices']['trendPrice']
                            ?? $carta['cardmarket']['prices']['avg30']
                            ?? 0;

                        return [
                            'id'           => $carta['id'],
                            'name'         => $carta['name'],
                            'precio_final' => (float) $precio,
                            'image'        => $carta['images']['large'] ?? $carta['images']['small'] ?? null,
                            'cardmarket'   => $carta['cardmarket']['url'] ?? null,
                        ];
                    })
                    ->filter(fn($c) => $c['precio_final'] > 0)
                    ->sortByDesc('precio_final')
                    ->take(10)
                    ->values();

                

                return response()->json($top10);
            }

        } catch (\Exception $e) {
            Log::error('Pokemon API error: ' . $e->getMessage());
        }

    }

  
}