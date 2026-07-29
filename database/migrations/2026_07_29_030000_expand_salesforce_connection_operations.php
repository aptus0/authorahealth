<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('salesforce_connections', function (Blueprint $table) {
            $table->string('api_version')->nullable()->after('instance_url');
            $table->string('environment')->default('production')->after('api_version');
            $table->json('assessment')->nullable()->after('last_error');
            $table->dateTime('assessed_at')->nullable()->after('assessment');
            $table->json('deployment_result')->nullable()->after('deployment_id');
            $table->dateTime('deployment_started_at')->nullable()->after('deployment_result');
            $table->dateTime('deployment_checked_at')->nullable()->after('deployment_started_at');
        });
    }

    public function down(): void
    {
        Schema::table('salesforce_connections', function (Blueprint $table) {
            $table->dropColumn([
                'api_version', 'environment', 'assessment', 'assessed_at',
                'deployment_result', 'deployment_started_at', 'deployment_checked_at',
            ]);
        });
    }
};
