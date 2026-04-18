<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->enum('unit_type', ['kg', 'pcs', 'pack'])->default('pcs');

            $table->decimal('cost_price', 10, 2);
            $table->decimal('selling_price', 10, 2);

            $table->decimal('stock_qty', 10, 3)->default(0);

            // ✅ soft delete
            $table->softDeletes();

            // timestamps
            $table->timestamps();

            // 🔥 optional (recommended)
            $table->string('image')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
