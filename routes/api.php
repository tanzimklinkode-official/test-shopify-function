<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RulesController;

Route::middleware(['verify.shopify'])->group(function () {
    Route::prefix('/rules')->group(function () {
        Route::post('/', [RulesController::class, 'create_rule']);
        // Route::get('/{id}', [RulesController::class, 'show_rule']);
        Route::get('/get-rules', [RulesController::class, 'get_rules']);
        Route::delete('/delete-rule/{id}', [RulesController::class, 'delete_rule']);
        Route::get('/get-rule/{id}', [RulesController::class, 'get_rule']);
        Route::put('/update-rule/{id}', [RulesController::class, 'update_rule']);
    });
});
