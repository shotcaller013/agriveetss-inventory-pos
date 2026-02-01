<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CreditController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/sales/top', [DashboardController::class, 'data']);


Route::middleware('auth:sanctum')->group(function () {
    // Protected routes go here
    Route::post('/products', [ProductController::class, 'storeProduct']);
    Route::get('/products', [ProductController::class, 'fetchProduct']);
    Route::put('/products/{id}', [ProductController::class, 'updateProduct']);
    Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);

    Route::post('/sales', [SalesController::class, 'storeSale']);
    Route::get('/reports/sales/daily', [SalesReportController::class, 'dailySales']);

    Route::post('/credits', [CreditController::class, 'storeCredit']);
    Route::get('/credits', [CreditController::class, 'fetchCredits']);
});
