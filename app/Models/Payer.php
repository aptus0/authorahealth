<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['organization_id', 'public_id', 'name', 'payer_code', 'phone', 'portal_url', 'status', 'configuration'])]
class Payer extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['configuration' => 'array'];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
