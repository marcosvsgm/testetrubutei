<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Venda::with(['produto.categoria']);

            // Filtrar por status se fornecido
            if ($request->has('status') && $request->status !== 'todas') {
                $query->where('status', $request->status);
            }

            // Filtrar por data
            if ($request->has('data_inicio')) {
                $query->whereDate('created_at', '>=', $request->data_inicio);
            }

            if ($request->has('data_fim')) {
                $query->whereDate('created_at', '<=', $request->data_fim);
            }

            // Ordenar por data mais recente
            $vendas = $query->orderBy('created_at', 'desc')->get();

            // Formatar os dados
            $vendas = $vendas->map(function ($venda) {
                return [
                    'id' => $venda->id,
                    'produto' => $venda->produto->nome,
                    'categoria' => $venda->produto->categoria->nome ?? 'Sem categoria',
                    'cliente' => $venda->cliente,
                    'quantidade' => $venda->quantidade,
                    'valorUnitario' => (float) $venda->valor_unitario,
                    'valorTotal' => (float) $venda->valor_total,
                    'status' => $venda->status,
                    'observacoes' => $venda->observacoes,
                    'data' => $venda->created_at->format('Y-m-d'),
                    'data_completa' => $venda->created_at->format('Y-m-d H:i:s')
                ];
            });

            return response()->json($vendas, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar vendas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'produto_id' => 'required|exists:produtos,id',
                'cliente' => 'required|string|max:255',
                'quantidade' => 'required|integer|min:1',
                'valor_unitario' => 'required|numeric|min:0',
                'status' => 'sometimes|in:pendente,concluida,cancelada',
                'observacoes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar estoque disponível
            $produto = Produto::find($request->produto_id);
            
            if ($produto->quantidade < $request->quantidade) {
                return response()->json([
                    'message' => 'Estoque insuficiente',
                    'estoque_disponivel' => $produto->quantidade
                ], 400);
            }

            DB::beginTransaction();

            // Criar a venda
            $venda = Venda::create($request->all());

            // Atualizar o estoque do produto
            if ($request->status !== 'cancelada') {
                $produto->quantidade -= $request->quantidade;
                $produto->save();
            }

            DB::commit();

            // Carregar relacionamentos
            $venda->load(['produto.categoria']);

            return response()->json([
                'message' => 'Venda criada com sucesso',
                'venda' => [
                    'id' => $venda->id,
                    'produto' => $venda->produto->nome,
                    'categoria' => $venda->produto->categoria->nome ?? 'Sem categoria',
                    'cliente' => $venda->cliente,
                    'quantidade' => $venda->quantidade,
                    'valorUnitario' => (float) $venda->valor_unitario,
                    'valorTotal' => (float) $venda->valor_total,
                    'status' => $venda->status,
                    'observacoes' => $venda->observacoes,
                    'data' => $venda->created_at->format('Y-m-d')
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao criar venda',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $venda = Venda::with(['produto.categoria'])->findOrFail($id);

            return response()->json([
                'id' => $venda->id,
                'produto' => $venda->produto->nome,
                'produto_id' => $venda->produto_id,
                'categoria' => $venda->produto->categoria->nome ?? 'Sem categoria',
                'cliente' => $venda->cliente,
                'quantidade' => $venda->quantidade,
                'valorUnitario' => (float) $venda->valor_unitario,
                'valorTotal' => (float) $venda->valor_total,
                'status' => $venda->status,
                'observacoes' => $venda->observacoes,
                'data' => $venda->created_at->format('Y-m-d'),
                'data_completa' => $venda->created_at->format('Y-m-d H:i:s')
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Venda não encontrada',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $venda = Venda::findOrFail($id);
            $produto = Produto::find($venda->produto_id);

            $validator = Validator::make($request->all(), [
                'cliente' => 'sometimes|string|max:255',
                'quantidade' => 'sometimes|integer|min:1',
                'valor_unitario' => 'sometimes|numeric|min:0',
                'status' => 'sometimes|in:pendente,concluida,cancelada',
                'observacoes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Se a quantidade mudou, ajustar o estoque
            if ($request->has('quantidade') && $request->quantidade != $venda->quantidade) {
                $diferenca = $request->quantidade - $venda->quantidade;
                
                if ($diferenca > 0 && $produto->quantidade < $diferenca) {
                    return response()->json([
                        'message' => 'Estoque insuficiente',
                        'estoque_disponivel' => $produto->quantidade
                    ], 400);
                }

                $produto->quantidade -= $diferenca;
                $produto->save();
            }

            // Se o status mudou para cancelada, devolver ao estoque
            if ($request->has('status') && $request->status === 'cancelada' && $venda->status !== 'cancelada') {
                $produto->quantidade += $venda->quantidade;
                $produto->save();
            }

            $venda->update($request->all());

            DB::commit();

            $venda->load(['produto.categoria']);

            return response()->json([
                'message' => 'Venda atualizada com sucesso',
                'venda' => [
                    'id' => $venda->id,
                    'produto' => $venda->produto->nome,
                    'categoria' => $venda->produto->categoria->nome ?? 'Sem categoria',
                    'cliente' => $venda->cliente,
                    'quantidade' => $venda->quantidade,
                    'valorUnitario' => (float) $venda->valor_unitario,
                    'valorTotal' => (float) $venda->valor_total,
                    'status' => $venda->status,
                    'observacoes' => $venda->observacoes,
                    'data' => $venda->created_at->format('Y-m-d')
                ]
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar venda',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $venda = Venda::findOrFail($id);
            $produto = Produto::find($venda->produto_id);

            DB::beginTransaction();

            // Se a venda não estava cancelada, devolver ao estoque
            if ($venda->status !== 'cancelada') {
                $produto->quantidade += $venda->quantidade;
                $produto->save();
            }

            $venda->delete();

            DB::commit();

            return response()->json([
                'message' => 'Venda excluída com sucesso'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao excluir venda',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
