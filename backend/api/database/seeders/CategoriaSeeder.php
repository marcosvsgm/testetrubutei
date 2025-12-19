<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Criando 500 categorias...');

        $categorias = [
            'Eletrônicos', 'Informática', 'Celulares', 'Tablets', 'Notebooks',
            'Periféricos', 'Acessórios', 'Games', 'Áudio', 'Vídeo',
            'Câmeras', 'Fotografia', 'TV', 'Home Theater', 'Smart Home',
            'Eletrodomésticos', 'Móveis', 'Decoração', 'Iluminação', 'Cozinha',
            'Banheiro', 'Quarto', 'Sala', 'Escritório', 'Jardim',
            'Ferramentas', 'Construção', 'Elétrica', 'Hidráulica', 'Pintura',
            'Automotivo', 'Motocicletas', 'Bicicletas', 'Peças', 'Acessórios Auto',
            'Esportes', 'Fitness', 'Camping', 'Pesca', 'Futebol',
            'Tênis', 'Basquete', 'Vôlei', 'Natação', 'Ciclismo',
            'Moda', 'Roupas', 'Calçados', 'Bolsas', 'Relógios',
            'Joias', 'Cosméticos', 'Perfumes', 'Cuidados Pessoais', 'Saúde',
            'Livros', 'Revistas', 'Papelaria', 'Instrumentos Musicais', 'Arte',
            'Brinquedos', 'Bebês', 'Infantil', 'Pet Shop', 'Alimentos',
            'Bebidas', 'Limpeza', 'Higiene', 'Utilidades', 'Presentes'
        ];

        $subcategorias = [
            'Premium', 'Básico', 'Intermediário', 'Profissional', 'Importado',
            'Nacional', 'Econômico', 'Luxo', 'Compacto', 'Grande Porte'
        ];

        $lote = [];
        $timestamp = now();

        for ($i = 1; $i <= 500; $i++) {
            $categoriaBase = $categorias[array_rand($categorias)];
            $sufixo = $i > count($categorias) ? ' - ' . $subcategorias[array_rand($subcategorias)] . ' ' . $i : '';
            
            $lote[] = [
                'nome' => $categoriaBase . $sufixo,
                'descricao' => 'Descrição da categoria ' . $categoriaBase . $sufixo,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ];

            // Inserir em lotes de 100 para melhor performance
            if (count($lote) >= 100) {
                DB::table('categorias')->insert($lote);
                $lote = [];
                $this->command->info("$i categorias criadas...");
            }
        }

        // Inserir o restante
        if (!empty($lote)) {
            DB::table('categorias')->insert($lote);
        }

        $this->command->info('✅ 500 categorias criadas com sucesso!');
    }
}
