<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['organization_id', 'public_id', 'medical_record_number', 'first_name', 'last_name', 'date_of_birth', 'status', 'metadata'])]
class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return ['date_of_birth' => 'date', 'metadata' => 'array'];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
