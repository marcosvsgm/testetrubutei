<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://ingenious-quietude-production-bcfd.up.railway.app',
        'https://testetrubutei-production-6485.up.railway.app',
        'http://localhost:3000',
        'http://localhost:5173'
    ],

    'allowed_origins_patterns' => ['/\.railway\.app$/'],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['*'],

    'max_age' => 600,

    'supports_credentials' => true,

];
