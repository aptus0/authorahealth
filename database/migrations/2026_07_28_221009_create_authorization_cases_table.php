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
        Schema::create('authorization_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->uuid('public_id');
            $table->string('case_number');
            $table->foreignId('patient_id')->constrained()->restrictOnDelete();
            $table->foreignId('payer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('draft');
            $table->string('priority')->default('routine');
            $table->date('service_date')->nullable();
            $table->dateTime('due_at')->nullable();
            $table->string('procedure_code')->nullable();
            $table->string('diagnosis_code')->nullable();
            $table->decimal('estimated_revenue', 12, 2)->nullable();
            $table->string('payer_reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['organization_id', 'public_id']);
            $table->unique(['organization_id', 'case_number']);
            $table->index(['organization_id', 'status', 'due_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('authorization_cases');
    }
};
