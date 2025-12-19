<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ConvertEmptyStringsToNull
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Converter strings vazias em null para todos os inputs
        $input = $request->all();
        
        array_walk_recursive($input, function (&$item) {
            if ($item === '') {
                $item = null;
            }
        });
        
        $request->merge($input);
        
        return $next($request);
    }
}
