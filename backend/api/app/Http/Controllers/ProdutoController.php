<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        // Paginação para melhor performance com muitos registros
        $perPage = $request->get('per_page', 500); // 500 produtos por página
        $search = $request->get('search', '');
        
        $query = Produto::with('categoria');
        
        // Busca por nome ou código
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('codigo', 'like', "%{$search}%");
            });
        }
        
        $produtos = $query->orderBy('nome')->paginate($perPage);
        
        return response()->json($produtos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'codigo' => 'nullable|string|max:255|unique:produtos,codigo',
            'preco' => 'required|numeric|min:0',
            'quantidade' => 'required|integer|min:0',
            'categoria_id' => 'nullable|exists:categorias,id',
            'ativo' => 'boolean'
        ]);

        // Converter string vazia em null para categoria_id
        if (isset($validated['categoria_id']) && $validated['categoria_id'] === '') {
            $validated['categoria_id'] = null;
        }

        $produto = Produto::create($validated);
        
        return response()->json($produto->load('categoria'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $produto = Produto::with('categoria')->findOrFail($id);
        return response()->json($produto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $produto = Produto::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'nullable|string',
            'codigo' => 'nullable|string|max:255|unique:produtos,codigo,' . $id,
            'preco' => 'sometimes|required|numeric|min:0',
            'quantidade' => 'sometimes|required|integer|min:0',
            'categoria_id' => 'nullable|exists:categorias,id',
            'ativo' => 'boolean'
        ]);

        // Converter string vazia em null para categoria_id
        if (isset($validated['categoria_id']) && $validated['categoria_id'] === '') {
            $validated['categoria_id'] = null;
        }

        $produto->update($validated);
        
        return response()->json($produto->load('categoria'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $produto = Produto::findOrFail($id);
        $produto->delete();
        
        return response()->json(['message' => 'Produto excluído com sucesso'], 200);
    }
}
