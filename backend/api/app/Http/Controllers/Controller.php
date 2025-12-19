<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="API Estoque",
 *     version="1.0.0",
 *     description="API para gerenciamento de estoque, produtos, categorias e vendas",
 *     @OA\Contact(
 *         email="admin@estoque.com"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Servidor de Desenvolvimento"
 * )
 * 
 * @OA\Tag(
 *     name="Categorias",
 *     description="Operações relacionadas a categorias"
 * )
 * 
 * @OA\Tag(
 *     name="Produtos",
 *     description="Operações relacionadas a produtos"
 * )
 * 
 * @OA\Tag(
 *     name="Vendas",
 *     description="Operações relacionadas a vendas"
 * )
 * 
 * @OA\Tag(
 *     name="Dashboard",
 *     description="Estatísticas e resumos"
 * )
 */
abstract class Controller
{
    //
}
