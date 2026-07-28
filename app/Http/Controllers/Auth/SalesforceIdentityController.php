<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SalesforceIdentityController extends Controller
{
    public function redirect(Request $request): RedirectResponse
    {
        abort_unless(filled(config('services.salesforce.client_id')), 503, 'Salesforce sign-in is not configured.');
        $state = Str::random(64);
        $request->session()->put('salesforce_identity_state', $state);

        return redirect()->away(rtrim(config('services.salesforce.login_url'), '/').'/services/oauth2/authorize?'.http_build_query([
            'response_type' => 'code',
            'client_id' => config('services.salesforce.client_id'),
            'redirect_uri' => route('auth.salesforce.callback'),
            'scope' => 'openid profile email api refresh_token',
            'state' => $state,
            'prompt' => 'login consent',
        ]));
    }

    public function callback(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'string'], 'state' => ['required', 'string']]);
        abort_unless(hash_equals((string) $request->session()->pull('salesforce_identity_state'), $request->string('state')->toString()), 419);

        $token = Http::asForm()->post(rtrim(config('services.salesforce.login_url'), '/').'/services/oauth2/token', [
            'grant_type' => 'authorization_code',
            'code' => $request->string('code')->toString(),
            'client_id' => config('services.salesforce.client_id'),
            'client_secret' => config('services.salesforce.client_secret'),
            'redirect_uri' => route('auth.salesforce.callback'),
        ])->throw()->json();
        $identity = Http::withToken($token['access_token'])->get($token['id'])->throw()->json();

        $email = Str::lower($identity['email'] ?? $identity['username'] ?? '');
        abort_if(blank($email), 422, 'Salesforce did not provide an email address.');

        $user = DB::transaction(function () use ($identity, $email): User {
            $user = User::where('email', $email)->first();
            if ($user) return $user;

            $orgId = $identity['organization_id'];
            $organization = Organization::firstOrCreate(
                ['slug' => 'salesforce-'.Str::lower($orgId)],
                ['public_id' => Str::uuid(), 'name' => $identity['organization_name'] ?? 'Salesforce Organization'],
            );
            Subscription::firstOrCreate(
                ['organization_id' => $organization->id],
                ['plan' => 'trial', 'status' => 'trialing', 'authorization_limit' => 500, 'trial_ends_at' => now()->addDays(14)],
            );

            return User::create([
                'organization_id' => $organization->id,
                'name' => $identity['display_name'] ?? $identity['first_name'] ?? $email,
                'email' => $email,
                'password' => Hash::make(Str::random(64)),
                'role' => 'organization_admin',
                'email_verified_at' => now(),
            ]);
        });

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->away(rtrim(env('FRONTEND_URL', 'https://authora-health.test'), '/').'/dashboard');
    }
}
