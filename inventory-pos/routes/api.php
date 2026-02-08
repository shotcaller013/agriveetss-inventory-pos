<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CreditController;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Authenticated
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/products', [ProductController::class, 'fetchProduct']);

});

/*
|--------------------------------------------------------------------------
| Cashier (POS operations)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:cashier'])->group(function () {


    // POS sales
    Route::post('/sales', [SalesController::class, 'storeSale']);

    // POS credit (CREATE ONLY)
    Route::post('/credits', [CreditController::class, 'storeCredit']);
});

/*
|--------------------------------------------------------------------------
| Admin ONLY
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    // Dashboard
    Route::get('/sales/top', [DashboardController::class, 'data']);

    Route::post('/products', [ProductController::class, 'storeProduct']);
    Route::put('/products/{id}', [ProductController::class, 'updateProduct']);
    Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);


    // Reports
    Route::get('/reports/sales/daily', [SalesReportController::class, 'dailySales']);

    // Credits (manage)
    Route::get('/credits', [CreditController::class, 'fetchCredits']);
    Route::post('/credits/{credit}/pay', [CreditController::class, 'processPayment']);
});
