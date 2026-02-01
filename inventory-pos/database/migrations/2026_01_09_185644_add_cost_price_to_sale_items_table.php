<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('sale_items', function (Blueprint $table) {
            if (!Schema::hasColumn('sale_items', 'cost_price')) {
                $table->decimal('cost_price', 10, 2)->after('unit_price');
            }
        });
    }

    public function down()
    {
        Schema::table('sale_items', function (Blueprint $table) {
            if (Schema::hasColumn('sale_items', 'cost_price')) {
                $table->dropColumn('cost_price');
            }
        });
    }
};
