<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SalesforceIntegrationController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::get('/csrf', [AuthController::class, 'csrf'])->middleware('throttle:30,1');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware(['auth:sanctum', 'organization'])->prefix('salesforce')->group(function () {
    Route::get('/', [SalesforceIntegrationController::class, 'show']);
    Route::post('/assess', [SalesforceIntegrationController::class, 'assess'])->middleware('throttle:10,1');
    Route::post('/install', [SalesforceIntegrationController::class, 'install'])->middleware('throttle:5,1');
});
