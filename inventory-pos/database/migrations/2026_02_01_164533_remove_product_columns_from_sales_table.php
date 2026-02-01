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
        Schema::table('sales', function (Blueprint $table) {
            if (Schema::hasColumn('sales', 'product_id')) {
                $table->dropColumn('product_id');
            }

            if (Schema::hasColumn('sales', 'quantity')) {
                $table->dropColumn('quantity');
            }

            if (Schema::hasColumn('sales', 'unit_price')) {
                $table->dropColumn('unit_price');
            }
        });
    }


    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained();
            $table->decimal('quantity', 10, 3);
            $table->decimal('unit_price', 10, 2);
        });
    }
};
