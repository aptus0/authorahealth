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
        Schema::table('salesforce_connections', function (Blueprint $table) {
            $table->string('provisioning_status')->default('not_started')->after('status');
            $table->string('deployment_id')->nullable()->after('provisioning_status');
            $table->unsignedTinyInteger('provisioning_progress')->default(0)->after('deployment_id');
            $table->string('provisioning_step')->nullable()->after('provisioning_progress');
            $table->dateTime('provisioned_at')->nullable()->after('last_synced_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salesforce_connections', function (Blueprint $table) {
            $table->dropColumn(['provisioning_status', 'deployment_id', 'provisioning_progress', 'provisioning_step', 'provisioned_at']);
        });
    }
};
