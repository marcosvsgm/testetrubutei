<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Categoria;

class Produto extends Model
{
    protected $table = 'produtos';

    protected $fillable = [
        'nome',
        'descricao',
        'codigo',
        'preco',
        'quantidade',
        'categoria_id',
        'ativo'
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'quantidade' => 'integer',
        'ativo' => 'boolean',
        'categoria_id' => 'integer'
    ];

    /**
     * Preparar valores antes de salvar
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($produto) {
            // Converter string vazia em null para categoria_id
            if ($produto->categoria_id === '' || $produto->categoria_id === 'null') {
                $produto->categoria_id = null;
            }
        });
    }

    // Relacionamento com Categoria
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    // Relacionamento com Vendas
    public function vendas()
    {
        return $this->hasMany(Venda::class);
    }
}
