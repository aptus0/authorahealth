<?php

namespace App\Http\Controllers;

use App\Models\AuthorizationCase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $organizationId = $request->user()->organization_id;
        $base = AuthorizationCase::query()->where('organization_id', $organizationId);

        return Inertia::render('Dashboard', [
            'metrics' => [
                'open' => (clone $base)->whereNotIn('status', ['approved', 'cancelled'])->count(),
                'dueToday' => (clone $base)->whereDate('due_at', today())->count(),
                'approved' => (clone $base)->where('status', 'approved')->count(),
                'revenueAtRisk' => (float) (clone $base)->whereIn('status', ['documentation_required', 'denied'])->sum('estimated_revenue'),
            ],
            'cases' => (clone $base)
                ->with(['patient:id,first_name,last_name', 'payer:id,name'])
                ->orderByRaw('due_at IS NULL, due_at')
                ->limit(10)
                ->get()
                ->map(fn (AuthorizationCase $case) => [
                    'id' => $case->public_id,
                    'number' => $case->case_number,
                    'patient' => trim($case->patient->first_name.' '.$case->patient->last_name),
                    'service' => $case->procedure_code ?: 'Not specified',
                    'payer' => $case->payer?->name ?: 'Not assigned',
                    'status' => $case->status,
                    'due' => $case->due_at?->toDateString(),
                ]),
        ]);
    }
}
