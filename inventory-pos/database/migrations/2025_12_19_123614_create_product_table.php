<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();

        $table->string('name');
        // $table->string('sku')->nullable()->unique();
        // $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
        $table->enum('unit_type', ['kg', 'pcs', 'pack'])->default('pcs');
        $table->decimal('cost_price', 10, 2);
        $table->decimal('selling_price', 10, 2);
        // $table->decimal('pack_size', 10, 3)->nullable(); // e.g., 0.5kg, 1kg
        $table->decimal('stock_qty', 10, 3)->default(0); // supports 0.25kg
        $table->decimal('reorder_level', 10, 3)->default(0);

        $table->boolean('is_active')->default(true);

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
