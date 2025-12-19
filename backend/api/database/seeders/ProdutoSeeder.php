<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;
use App\Models\Categoria;
use Illuminate\Support\Facades\DB;

class ProdutoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Criando 50000 produtos...');

        $categorias = Categoria::pluck('id')->toArray();
        
        if (empty($categorias)) {
            $this->command->error('Nenhuma categoria encontrada. Execute o CategoriaSeeder primeiro.');
            return;
        }

        $nomesProdutos = [
            'Notebook', 'Mouse', 'Teclado', 'Monitor', 'Webcam',
            'Headset', 'Microfone', 'Caixa de Som', 'HD Externo', 'SSD',
            'Pendrive', 'Adaptador', 'Cabo', 'Hub USB', 'Carregador',
            'Smartphone', 'Tablet', 'Smartwatch', 'Fone de Ouvido', 'Powerbank',
            'Cadeira', 'Mesa', 'Luminária', 'Suporte', 'Organizador',
            'Mochila', 'Case', 'Película', 'Capinha', 'Película de Vidro'
        ];

        $marcas = [
            'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Samsung', 'LG', 'Sony',
            'Apple', 'Microsoft', 'Logitech', 'Razer', 'Corsair', 'Kingston',
            'Sandisk', 'Western Digital', 'Seagate', 'Intel', 'AMD', 'Nvidia'
        ];

        $modelos = [
            'Plus', 'Pro', 'Max', 'Mini', 'Ultra', 'Lite', 'Premium', 'Basic',
            'Standard', 'Advanced', 'Elite', 'Master', 'Gamer', 'Business'
        ];

        $lote = [];
        $timestamp = now();
        $loteSize = 1000; // Inserir em lotes de 1000 para melhor performance

        for ($i = 1; $i <= 50000; $i++) {
            $nomeProduto = $nomesProdutos[array_rand($nomesProdutos)];
            $marca = $marcas[array_rand($marcas)];
            $modelo = $modelos[array_rand($modelos)];
            
            $nome = "$marca $nomeProduto $modelo #$i";
            $codigo = 'PROD' . str_pad($i, 6, '0', STR_PAD_LEFT);
            $preco = rand(50, 50000) / 10; // Preços entre 5.00 e 5000.00
            $quantidade = rand(0, 500);

            $lote[] = [
                'nome' => $nome,
                'descricao' => "Descrição detalhada do produto $nome",
                'codigo' => $codigo,
                'preco' => $preco,
                'quantidade' => $quantidade,
                'categoria_id' => $categorias[array_rand($categorias)],
                'ativo' => rand(0, 100) > 5, // 95% dos produtos ativos
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ];

            // Inserir em lotes
            if (count($lote) >= $loteSize) {
                DB::table('produtos')->insert($lote);
                $lote = [];
                $this->command->info("$i produtos criados...");
            }
        }

        // Inserir o restante
        if (!empty($lote)) {
            DB::table('produtos')->insert($lote);
        }

        $this->command->info('✅ 50000 produtos criados com sucesso!');
    }
}
