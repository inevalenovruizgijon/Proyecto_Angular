<?php

use Illuminate\Http\Request;
use App\Http\Controllers\ColeccionController;
use Illuminate\Support\Facades\Route;

Route::get('/coleccion', [ColeccionController::class, 'index']);
Route::post('/coleccion', [ColeccionController::class, 'store']);
Route::delete('/coleccion/{id}', [ColeccionController::class, 'destroy']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
