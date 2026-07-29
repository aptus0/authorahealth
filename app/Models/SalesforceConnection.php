<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'organization_id', 'salesforce_org_id', 'salesforce_user_id', 'instance_url',
    'access_token', 'refresh_token', 'token_type', 'scopes', 'status',
    'connected_at', 'last_synced_at', 'last_error',
    'provisioning_status', 'deployment_id', 'provisioning_progress', 'provisioning_step', 'provisioned_at',
    'api_version', 'environment', 'assessment', 'assessed_at', 'deployment_result',
    'deployment_started_at', 'deployment_checked_at',
])]
class SalesforceConnection extends Model
{
    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
            'refresh_token' => 'encrypted',
            'scopes' => 'array',
            'connected_at' => 'datetime',
            'last_synced_at' => 'datetime',
            'provisioned_at' => 'datetime',
            'assessment' => 'array',
            'assessed_at' => 'datetime',
            'deployment_result' => 'array',
            'deployment_started_at' => 'datetime',
            'deployment_checked_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
