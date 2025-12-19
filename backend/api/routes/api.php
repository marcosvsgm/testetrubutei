<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\VendaController;
use App\Http\Controllers\DashboardController;

// Rotas de Categorias
Route::apiResource('categorias', CategoriaController::class);

// Rotas de Produtos
Route::apiResource('produtos', ProdutoController::class);

// Rotas de Vendas
Route::apiResource('vendas', VendaController::class);

// Rotas de Dashboard
Route::get('dashboard', [DashboardController::class, 'index']);
Route::get('dashboard/vendas-resumo', [DashboardController::class, 'vendasResumo']);
