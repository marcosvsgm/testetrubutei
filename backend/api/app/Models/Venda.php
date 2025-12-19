<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    protected $table = 'vendas';

    protected $fillable = [
        'produto_id',
        'cliente',
        'quantidade',
        'valor_unitario',
        'valor_total',
        'status',
        'observacoes'
    ];

    protected $casts = [
        'quantidade' => 'integer',
        'valor_unitario' => 'decimal:2',
        'valor_total' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Relacionamento com Produto
     */
    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }

    /**
     * Calcular o valor total automaticamente
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($venda) {
            $venda->valor_total = $venda->quantidade * $venda->valor_unitario;
        });

        static::updating(function ($venda) {
            $venda->valor_total = $venda->quantidade * $venda->valor_unitario;
        });
    }
}
