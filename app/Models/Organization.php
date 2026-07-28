<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['public_id', 'name', 'slug', 'timezone', 'status', 'settings'])]
class Organization extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['settings' => 'array'];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function patients(): HasMany
    {
        return $this->hasMany(Patient::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }

    public function salesforceConnection(): HasOne
    {
        return $this->hasOne(SalesforceConnection::class);
    }
}
