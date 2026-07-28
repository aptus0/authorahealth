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
        Schema::create('payers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->uuid('public_id');
            $table->string('name');
            $table->string('payer_code')->nullable();
            $table->string('phone')->nullable();
            $table->string('portal_url')->nullable();
            $table->string('status')->default('active');
            $table->json('configuration')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'public_id']);
            $table->index(['organization_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payers');
    }
};
