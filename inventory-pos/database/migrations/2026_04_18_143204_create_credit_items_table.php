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
    Schema::create('credit_items', function (Blueprint $table) {
        $table->id();

        // foreign keys
        $table->foreignId('credit_id')
            ->constrained('credits')
            ->cascadeOnDelete();

        $table->foreignId('product_id')
            ->constrained('products');

        // data
        $table->integer('quantity');
        $table->decimal('unit_price', 12, 2);
        $table->decimal('subtotal', 12, 2);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_items');
    }
};
