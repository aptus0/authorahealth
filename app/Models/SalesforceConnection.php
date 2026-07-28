<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'organization_id', 'salesforce_org_id', 'salesforce_user_id', 'instance_url',
    'access_token', 'refresh_token', 'token_type', 'scopes', 'status',
    'connected_at', 'last_synced_at', 'last_error',
    'provisioning_status', 'deployment_id', 'provisioning_progress', 'provisioning_step', 'provisioned_at',
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
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
