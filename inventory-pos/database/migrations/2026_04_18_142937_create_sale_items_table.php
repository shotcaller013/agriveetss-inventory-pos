<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();

            // foreign keys
            $table->foreignId('sales_id')
                ->constrained('sales')
                ->cascadeOnDelete();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            // data
            $table->decimal('quantity', 10, 3);
            $table->decimal('cost_price', 10, 2);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('subtotal', 10, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
