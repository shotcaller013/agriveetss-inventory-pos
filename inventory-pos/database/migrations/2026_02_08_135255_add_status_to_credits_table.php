<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('credits', function (Blueprint $table) {
            $table->enum('status', ['open', 'partial', 'paid'])
                  ->default('open')
                  ->after('due_date');
        });
    }

    public function down(): void
    {
        Schema::table('credits', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};

