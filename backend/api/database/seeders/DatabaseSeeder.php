<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🚀 Iniciando população do banco de dados...');
        $this->command->newLine();

        // Criar usuário de teste
        $this->command->info('Criando usuário de teste...');
        User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@estoque.com',
        ]);
        $this->command->info('✅ Usuário criado!');
        $this->command->newLine();

        // Executar seeders na ordem correta
        $this->command->info('📁 Criando categorias...');
        $this->call(CategoriaSeeder::class);
        $this->command->newLine();

        $this->command->info('📦 Criando produtos...');
        $this->call(ProdutoSeeder::class);
        $this->command->newLine();

        $this->command->info('💰 Criando vendas...');
        $this->call(VendaSeeder::class);
        $this->command->newLine();

        $this->command->info('🎉 Banco de dados populado com sucesso!');
        $this->command->info('Total: 500 categorias, 50.000 produtos e 500 vendas');
    }
}
