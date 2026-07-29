<?php

use App\Http\Controllers\Api\AiReadinessController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SalesforceIntegrationController;
use App\Http\Controllers\Api\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::get('/csrf', [AuthController::class, 'csrf'])->middleware('throttle:30,1');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware(['auth:sanctum', 'organization'])->post(
    '/ai/authorizations/{case}/readiness',
    AiReadinessController::class,
)->middleware('throttle:10,1');

Route::middleware(['auth:sanctum', 'organization'])->group(function () {
    Route::get('/dashboard', [WorkspaceController::class, 'dashboard']);
    Route::get('/settings', [WorkspaceController::class, 'settings']);
    Route::put('/settings/profile', [WorkspaceController::class, 'updateProfile'])->middleware('throttle:20,1');
    Route::put('/settings/password', [WorkspaceController::class, 'updatePassword'])->middleware('throttle:10,1');
    Route::put('/settings/ai', [WorkspaceController::class, 'updateAi'])->middleware('throttle:10,1');
    Route::delete('/settings/ai', [WorkspaceController::class, 'removeAi'])->middleware('throttle:10,1');
});

Route::middleware(['auth:sanctum', 'organization'])->prefix('salesforce')->group(function () {
    Route::get('/', [SalesforceIntegrationController::class, 'show']);
    Route::post('/assess', [SalesforceIntegrationController::class, 'assess'])->middleware('throttle:10,1');
    Route::post('/install', [SalesforceIntegrationController::class, 'install'])->middleware('throttle:5,1');
    Route::get('/deployment', [SalesforceIntegrationController::class, 'deployment'])->middleware('throttle:30,1');
});
