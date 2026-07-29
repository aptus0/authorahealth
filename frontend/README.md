# Authora Web

The Authora Health customer-facing application.

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Motion micro-interactions
- Cookie-based authentication through the Authora API
- Salesforce identity sign-in

Local URL: `https://authora-health.test`

## Vercel deployment

The repository contains a Laravel API and this Next.js application. Recommended
Vercel project settings:

- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: leave the override empty (`Next.js default`)
- Install Command: `npm ci`

Set `NEXT_PUBLIC_API_URL` to the public Laravel API origin. Do not configure
`dist` as the Output Directory; this application uses the Next.js build output.

The repository-level `vercel.json` also supports deployments where the Vercel
project still points at the repository root.
