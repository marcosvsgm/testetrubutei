<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriaController extends Controller
{
    /**
     * @OA\Get(
     *     path="/categorias",
     *     tags={"Categorias"},
     *     summary="Listar todas as categorias",
     *     description="Retorna uma lista paginada de categorias",
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Número de itens por página",
     *         required=false,
     *         @OA\Schema(type="integer", default=500)
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Buscar por nome",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de categorias",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="nome", type="string", example="Eletrônicos"),
     *                 @OA\Property(property="descricao", type="string", example="Produtos eletrônicos"),
     *                 @OA\Property(property="ativo", type="boolean", example=true)
     *             ))
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        // Paginação para melhor performance
        $perPage = $request->get('per_page', 500);
        $search = $request->get('search', '');
        
        $query = Categoria::query();
        
        // Busca por nome
        if ($search) {
            $query->where('nome', 'like', "%{$search}%");
        }
        
        $categorias = $query->orderBy('nome')->paginate($perPage);
        
        return response()->json($categorias);
    }

    /**
     * @OA\Post(
     *     path="/categorias",
     *     tags={"Categorias"},
     *     summary="Criar nova categoria",
     *     description="Cria uma nova categoria no sistema",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nome"},
     *             @OA\Property(property="nome", type="string", example="Eletrônicos"),
     *             @OA\Property(property="descricao", type="string", example="Produtos eletrônicos"),
     *             @OA\Property(property="ativo", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Categoria criada com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="nome", type="string", example="Eletrônicos"),
     *             @OA\Property(property="descricao", type="string", example="Produtos eletrônicos"),
     *             @OA\Property(property="ativo", type="boolean", example=true)
     *         )
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'ativo' => 'boolean'
        ]);

        $categoria = Categoria::create($validated);
        
        return response()->json($categoria, 201);
    }

    /**
     * @OA\Get(
     *     path="/categorias/{id}",
     *     tags={"Categorias"},
     *     summary="Obter categoria específica",
     *     description="Retorna os detalhes de uma categoria",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da categoria",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalhes da categoria",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="nome", type="string", example="Eletrônicos"),
     *             @OA\Property(property="descricao", type="string", example="Produtos eletrônicos"),
     *             @OA\Property(property="ativo", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(response=404, description="Categoria não encontrada")
     * )
     */
    public function show(string $id): JsonResponse
    {
        $categoria = Categoria::findOrFail($id);
        return response()->json($categoria);
    }

    /**
     * @OA\Put(
     *     path="/categorias/{id}",
     *     tags={"Categorias"},
     *     summary="Atualizar categoria",
     *     description="Atualiza os dados de uma categoria",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da categoria",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nome", type="string", example="Eletrônicos"),
     *             @OA\Property(property="descricao", type="string", example="Produtos eletrônicos"),
     *             @OA\Property(property="ativo", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Categoria atualizada com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="nome", type="string", example="Eletrônicos"),
     *             @OA\Property(property="descricao", type="string", example="Produtos eletrônicos"),
     *             @OA\Property(property="ativo", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(response=404, description="Categoria não encontrada")
     * )
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $categoria = Categoria::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'nullable|string',
            'ativo' => 'boolean'
        ]);

        $categoria->update($validated);
        
        return response()->json($categoria);
    }

    /**
     * @OA\Delete(
     *     path="/categorias/{id}",
     *     tags={"Categorias"},
     *     summary="Excluir categoria",
     *     description="Remove uma categoria do sistema",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da categoria",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Categoria excluída com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Categoria excluída com sucesso")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Categoria não encontrada")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();
        
        return response()->json(['message' => 'Categoria excluída com sucesso'], 200);
    }
}
