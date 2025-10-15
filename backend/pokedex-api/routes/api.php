<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Models\Favorite;

Route::get('/pokemon', function (Request $request) {
    $limit = $request->query('limit', 10);
    $offset = $request->query('offset', 0);

    // Step 1: Get the basic Pokémon list
    $response = Http::get("https://pokeapi.co/api/v2/pokemon?limit={$limit}&offset={$offset}");

    if ($response->failed()) {
        return response()->json(['error' => 'Failed to fetch Pokémon list'], 500);
    }

    $results = $response->json('results');

    // Step 2: Fetch details for each Pokémon
    $pokemonDetails = collect($results)->map(function ($poke) {
        $detailResponse = Http::get($poke['url']);

        if ($detailResponse->failed()) {
            return [
                'name' => $poke['name'],
                'image' => null,
                'types' => [],
                'height' => null,
                'weight' => null,
            ];
        }

        $data = $detailResponse->json();

        return [
            'name' => $data['name'],
            'image' => $data['sprites']['other']['official-artwork']['front_default'] ?? null,
            'types' => collect($data['types'])->pluck('type.name'),
            'height' => $data['height'],
            'weight' => $data['weight'],
        ];
    });

    return response()->json($pokemonDetails);
});

Route::get('/favorites', function () {
    return \App\Models\Favorite::all();
});

Route::post('/favorites', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string',
        'image' => 'nullable|string',
        'types' => 'nullable|array',
        'height' => 'nullable|integer',
        'weight' => 'nullable|integer',
    ]);

    $favorite = Favorite::create($validated);
    return response()->json($favorite, 201);
});

Route::delete('/favorites/{id}', function ($id) {
    $favorite = \App\Models\Favorite::findOrFail($id);
    $favorite->delete();
    return response()->json(['message' => 'Deleted successfully']);
});