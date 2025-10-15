<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            $table->string('image')->nullable();
            $table->json('types')->nullable();
            $table->integer('height')->nullable();
            $table->integer('weight')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            $table->dropColumn(['image', 'types', 'height', 'weight']);
        });
    }
};
