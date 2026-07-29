<?php

namespace App\Integrations\OpenAI;

use App\Models\AiProviderCredential;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class OpenAiClient
{
    public function __construct(private readonly AiProviderCredential $credential) {}

    public function respond(string $instructions, string $input): string
    {
        $response = Http::acceptJson()
            ->withToken($this->credential->api_key)
            ->timeout(45)
            ->retry(2, 500, throw: false)
            ->post('https://api.openai.com/v1/responses', [
                'model' => $this->credential->model,
                'instructions' => $instructions,
                'input' => $input,
                'store' => false,
            ]);

        if ($response->failed()) {
            $message = match ($response->status()) {
                401 => 'The OpenAI API key is invalid or no longer active.',
                429 => 'The OpenAI project rate or spend limit was reached.',
                default => 'OpenAI could not complete the request.',
            };

            $this->credential->update(['status' => 'error', 'last_error' => $message]);
            throw new RuntimeException($message);
        }

        $output = collect($response->json('output', []))
            ->flatMap(fn (array $item) => Arr::get($item, 'content', []))
            ->firstWhere('type', 'output_text');
        $text = is_array($output) ? ($output['text'] ?? null) : null;

        if (! is_string($text) || $text === '') {
            throw new RuntimeException('OpenAI returned an empty response.');
        }

        $this->credential->update([
            'status' => 'connected',
            'last_validated_at' => now(),
            'last_error' => null,
        ]);

        return $text;
    }
}
