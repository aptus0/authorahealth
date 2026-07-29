<?php

use App\Http\Controllers\AiSettingsController;
use App\Http\Controllers\Auth\SalesforceIdentityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalesforceOAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('guest')->group(function () {
    Route::get('/auth/salesforce/redirect', [SalesforceIdentityController::class, 'redirect'])->name('auth.salesforce.redirect');
    Route::get('/auth/salesforce/callback', [SalesforceIdentityController::class, 'callback'])->name('auth.salesforce.callback');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified', 'organization'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/settings/ai', [AiSettingsController::class, 'edit'])->name('settings.ai.edit');
    Route::put('/settings/ai', [AiSettingsController::class, 'update'])->name('settings.ai.update');
    Route::post('/settings/ai/test', [AiSettingsController::class, 'test'])->name('settings.ai.test');
    Route::delete('/settings/ai', [AiSettingsController::class, 'destroy'])->name('settings.ai.destroy');

    Route::prefix('settings/integrations/salesforce')->name('integrations.salesforce.')->group(function () {
        Route::get('/', [SalesforceOAuthController::class, 'index'])->name('index');
        Route::get('/connect', [SalesforceOAuthController::class, 'redirect'])->name('redirect');
        Route::get('/callback', [SalesforceOAuthController::class, 'callback'])->name('callback');
        Route::post('/test', [SalesforceOAuthController::class, 'test'])->name('test');
        Route::delete('/', [SalesforceOAuthController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__.'/auth.php';
