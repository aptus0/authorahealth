export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.authora-health.test";

let csrfToken = "";

export async function initializeCsrf() {
  const response = await fetch(`${API_URL}/api/auth/csrf`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("The secure session could not be initialized. Please try again.");
  }

  const body = (await response.json()) as { token?: string };
  if (!body.token) {
    throw new Error("The secure session could not be initialized. Please try again.");
  }

  csrfToken = body.token;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const method = init.method?.toUpperCase() ?? "GET";
  const headers = new Headers(init.headers);

  headers.set("Accept", "application/json");

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    if (csrfToken) headers.set("X-CSRF-TOKEN", csrfToken);
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });
}
