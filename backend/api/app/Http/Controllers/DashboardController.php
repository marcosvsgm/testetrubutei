<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\Produto;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function index(Request $request)
    {
        try {
            $hoje = Carbon::today();
            $mesAtual = Carbon::now()->startOfMonth();

            // Estatísticas gerais
            $totalProdutos = Produto::where('ativo', true)->count();
            $totalCategorias = Categoria::count();
            
            // Vendas de hoje
            $vendasHoje = Venda::whereDate('created_at', $hoje)
                ->where('status', '!=', 'cancelada')
                ->count();
            
            // Valor total de vendas de hoje
            $valorTotalHoje = Venda::whereDate('created_at', $hoje)
                ->where('status', '!=', 'cancelada')
                ->sum('valor_total');

            // Vendas do mês
            $vendasMes = Venda::where('created_at', '>=', $mesAtual)
                ->where('status', '!=', 'cancelada')
                ->count();

            // Valor total de vendas do mês
            $valorTotalMes = Venda::where('created_at', '>=', $mesAtual)
                ->where('status', '!=', 'cancelada')
                ->sum('valor_total');

            // Produtos com estoque baixo (menos de 10 unidades)
            $produtosEstoqueBaixo = Produto::where('quantidade', '<', 10)
                ->where('ativo', true)
                ->count();

            // Últimas atividades (últimas 10 vendas)
            $ultimasAtividades = Venda::with(['produto'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($venda) {
                    $tempo = $venda->created_at->diffForHumans();
                    $icone = match($venda->status) {
                        'concluida' => '✅',
                        'pendente' => '⏳',
                        'cancelada' => '❌',
                        default => '📝'
                    };

                    return [
                        'icon' => $icone,
                        'title' => "Venda: {$venda->produto->nome}",
                        'description' => "Cliente: {$venda->cliente}",
                        'time' => $tempo,
                        'valor' => (float) $venda->valor_total
                    ];
                });

            // Produtos mais vendidos
            $produtosMaisVendidos = Venda::select('produto_id', DB::raw('SUM(quantidade) as total_vendido'))
                ->where('status', '!=', 'cancelada')
                ->groupBy('produto_id')
                ->orderBy('total_vendido', 'desc')
                ->limit(5)
                ->with('produto')
                ->get()
                ->map(function ($venda) {
                    return [
                        'name' => $venda->produto->nome,
                        'sales' => (int) $venda->total_vendido,
                        'percentage' => 0 // Será calculado no frontend
                    ];
                });

            // Calcular porcentagem relativa ao mais vendido
            if ($produtosMaisVendidos->isNotEmpty()) {
                $maxSales = $produtosMaisVendidos->first()['sales'];
                $produtosMaisVendidos = $produtosMaisVendidos->map(function ($produto) use ($maxSales) {
                    $produto['percentage'] = $maxSales > 0 ? ($produto['sales'] / $maxSales) * 100 : 0;
                    return $produto;
                });
            }

            // Vendas por categoria
            $vendasPorCategoria = Venda::select('categorias.nome', DB::raw('COUNT(*) as total'))
                ->join('produtos', 'vendas.produto_id', '=', 'produtos.id')
                ->join('categorias', 'produtos.categoria_id', '=', 'categorias.id')
                ->where('vendas.status', '!=', 'cancelada')
                ->groupBy('categorias.nome')
                ->get();

            // Vendas dos últimos 7 dias
            $vendasUltimos7Dias = [];
            for ($i = 6; $i >= 0; $i--) {
                $data = Carbon::today()->subDays($i);
                $total = Venda::whereDate('created_at', $data)
                    ->where('status', '!=', 'cancelada')
                    ->sum('valor_total');
                
                $vendasUltimos7Dias[] = [
                    'data' => $data->format('d/m'),
                    'valor' => (float) $total
                ];
            }

            return response()->json([
                'stats' => [
                    'totalProdutos' => $totalProdutos,
                    'totalCategorias' => $totalCategorias,
                    'vendasHoje' => $vendasHoje,
                    'valorTotalHoje' => (float) $valorTotalHoje,
                    'vendasMes' => $vendasMes,
                    'valorTotalMes' => (float) $valorTotalMes,
                    'produtosEstoqueBaixo' => $produtosEstoqueBaixo
                ],
                'ultimasAtividades' => $ultimasAtividades,
                'produtosMaisVendidos' => $produtosMaisVendidos,
                'vendasPorCategoria' => $vendasPorCategoria,
                'vendasUltimos7Dias' => $vendasUltimos7Dias
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar dados do dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales summary
     */
    public function vendasResumo(Request $request)
    {
        try {
            $query = Venda::query();

            // Filtrar por período se fornecido
            if ($request->has('periodo')) {
                switch ($request->periodo) {
                    case 'hoje':
                        $query->whereDate('created_at', Carbon::today());
                        break;
                    case 'semana':
                        $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                        break;
                    case 'mes':
                        $query->whereMonth('created_at', Carbon::now()->month);
                        break;
                    case 'ano':
                        $query->whereYear('created_at', Carbon::now()->year);
                        break;
                }
            }

            $totalVendas = $query->where('status', '!=', 'cancelada')->count();
            $valorTotal = $query->where('status', '!=', 'cancelada')->sum('valor_total');
            $vendasPendentes = $query->where('status', 'pendente')->count();
            $vendasConcluidas = $query->where('status', 'concluida')->count();
            $vendasCanceladas = $query->where('status', 'cancelada')->count();

            return response()->json([
                'totalVendas' => $totalVendas,
                'valorTotal' => (float) $valorTotal,
                'vendasPendentes' => $vendasPendentes,
                'vendasConcluidas' => $vendasConcluidas,
                'vendasCanceladas' => $vendasCanceladas,
                'ticketMedio' => $totalVendas > 0 ? (float) ($valorTotal / $totalVendas) : 0
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar resumo de vendas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
