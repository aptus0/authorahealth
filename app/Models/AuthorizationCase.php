<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'organization_id', 'public_id', 'case_number', 'patient_id', 'payer_id',
    'assigned_to', 'status', 'priority', 'service_date', 'due_at',
    'procedure_code', 'diagnosis_code', 'estimated_revenue', 'payer_reference', 'notes',
])]
class AuthorizationCase extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'service_date' => 'date',
            'due_at' => 'datetime',
            'estimated_revenue' => 'decimal:2',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(Payer::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
