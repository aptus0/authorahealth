<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['organization_id', 'actor_id', 'event', 'auditable_type', 'auditable_id', 'ip_address', 'user_agent', 'context'])]
class AuditEvent extends Model
{
    protected function casts(): array
    {
        return ['context' => 'array'];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
