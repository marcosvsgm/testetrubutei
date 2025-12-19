<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;
use App\Models\Produto;
use App\Models\Venda;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class VendaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Criando 500 vendas...');

        // Buscar IDs de produtos existentes para melhor performance
        $produtoIds = DB::table('produtos')->pluck('id')->toArray();

        if (empty($produtoIds)) {
            $this->command->error('Nenhum produto encontrado. Execute os seeders de categorias e produtos primeiro.');
            return;
        }

        $clientes = [
            'João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Souza',
            'Juliana Lima', 'Ricardo Ferreira', 'Patrícia Alves', 'Fernando Rocha', 'Camila Martins',
            'Roberto Almeida', 'Luciana Pereira', 'Marcos Barbosa', 'Tatiana Nunes', 'André Cardoso',
            'Beatriz Campos', 'Gabriel Torres', 'Renata Dias', 'Paulo Mendes', 'Carla Freitas',
            'Eduardo Santos', 'Larissa Costa', 'Felipe Ribeiro', 'Vanessa Lima', 'Bruno Souza',
            'Amanda Oliveira', 'Rodrigo Martins', 'Daniela Silva', 'Thiago Ferreira', 'Bianca Rocha',
            'Leonardo Alves', 'Fernanda Castro', 'Gustavo Nascimento', 'Isabela Moraes', 'Rafael Gomes',
            'Priscila Araújo', 'Vinícius Monteiro', 'Cristina Batista', 'Diego Correia', 'Aline Cardoso',
            'Marcelo Lima', 'Sabrina Reis', 'Lucas Fernandes', 'Natália Pinto', 'William Santos',
            'Jéssica Borges', 'Fábio Cunha', 'Carolina Sousa', 'Henrique Cavalcanti', 'Marina Rodrigues'
        ];

        $status = ['concluida', 'pendente', 'cancelada'];
        $observacoes = [
            null, null, null, // 60% sem observações
            'Venda com desconto especial',
            'Cliente preferencial',
            'Pagamento à vista',
            'Entrega urgente',
            'Primeira compra',
            'Compra recorrente',
            'Promoção de Black Friday'
        ];

        $lote = [];
        $loteSize = 100;

        for ($i = 1; $i <= 500; $i++) {
            $produtoId = $produtoIds[array_rand($produtoIds)];
            $quantidade = rand(1, 10);
            $valorUnitario = rand(50, 50000) / 10; // Valores entre 5.00 e 5000.00
            $statusVenda = $status[array_rand($status)];
            
            // Data aleatória nos últimos 90 dias (3 meses)
            $diasAtras = rand(0, 90);
            $horasAtras = rand(0, 23);
            $minutosAtras = rand(0, 59);
            $dataVenda = Carbon::now()
                ->subDays($diasAtras)
                ->setTime($horasAtras, $minutosAtras, 0);

            $lote[] = [
                'produto_id' => $produtoId,
                'cliente' => $clientes[array_rand($clientes)],
                'quantidade' => $quantidade,
                'valor_unitario' => $valorUnitario,
                'valor_total' => $quantidade * $valorUnitario,
                'status' => $statusVenda,
                'observacoes' => $observacoes[array_rand($observacoes)],
                'created_at' => $dataVenda,
                'updated_at' => $dataVenda
            ];

            // Inserir em lotes
            if (count($lote) >= $loteSize) {
                DB::table('vendas')->insert($lote);
                $lote = [];
                $this->command->info("$i vendas criadas...");
            }
        }

        // Inserir o restante
        if (!empty($lote)) {
            DB::table('vendas')->insert($lote);
        }

        $this->command->info('✅ 500 vendas criadas com sucesso!');
    }
}
