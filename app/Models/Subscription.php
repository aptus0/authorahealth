<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'organization_id', 'plan', 'status', 'provider', 'provider_customer_id',
    'provider_subscription_id', 'authorization_limit', 'trial_ends_at',
    'current_period_ends_at', 'cancelled_at',
])]
class Subscription extends Model
{
    protected function casts(): array
    {
        return [
            'trial_ends_at' => 'datetime',
            'current_period_ends_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
