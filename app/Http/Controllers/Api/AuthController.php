<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'organization_name' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = DB::transaction(function () use ($data): User {
            $organization = Organization::create([
                'public_id' => Str::uuid(),
                'name' => $data['organization_name'],
                'slug' => Str::slug($data['organization_name']).'-'.Str::lower(Str::random(6)),
            ]);
            Subscription::create([
                'organization_id' => $organization->id,
                'plan' => 'trial',
                'status' => 'trialing',
                'authorization_limit' => 500,
                'trial_ends_at' => now()->addDays(14),
            ]);

            return User::create([
                'organization_id' => $organization->id,
                'name' => $data['name'],
                'email' => Str::lower($data['email']),
                'password' => Hash::make($data['password']),
                'role' => 'organization_admin',
            ]);
        });

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['user' => $this->payload($user)], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        abort_unless(Auth::attempt($credentials), 422, 'The provided credentials are incorrect.');
        $request->session()->regenerate();

        return response()->json(['user' => $this->payload($request->user())]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->payload($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([], 204);
    }

    private function payload(User $user): array
    {
        $user->loadMissing('organization.subscription', 'organization.salesforceConnection');
        return [
            'id' => $user->id, 'name' => $user->name, 'email' => $user->email,
            'role' => $user->role, 'organization' => $user->organization,
        ];
    }
}
