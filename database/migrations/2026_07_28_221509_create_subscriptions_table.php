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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('plan')->default('trial');
            $table->string('status')->default('trialing');
            $table->string('provider')->nullable();
            $table->string('provider_customer_id')->nullable();
            $table->string('provider_subscription_id')->nullable();
            $table->unsignedInteger('authorization_limit')->default(500);
            $table->dateTime('trial_ends_at')->nullable();
            $table->dateTime('current_period_ends_at')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
