<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    
 'firebase' =>[
    'apiKey'=> "AIzaSyCz_KoXd3WP5QIRj3sK7ctg3z0-ZbLPrWo",
    'authDomain'=> "tvon-escalante.firebaseapp.com",
    'projectId'=> "tvon-escalante",
    'storageBucket'=> "tvon-escalante.appspot.com",
    'messagingSenderId'=> "233458040213",
    'appId'=> "1:233458040213:web:b7b5b2cc4a71e030904a9c",
    'measurementId'=> "G-SSVE9QJHRY"
 ],

];
