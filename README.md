# insighta-web

Web portal for Insighta Labs — built with Next.js 14, TypeScript, and Tailwind CSS.

**Live:** https://insighta-web.vercel.app  
**API:** https://profile-api-zeta.vercel.app

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Login — GitHub OAuth |
| `/dashboard` | Metrics overview + user info |
| `/profiles` | Paginated profile table with filters |
| `/profiles/[id]` | Full profile detail card |
| `/search` | Natural language search |
| `/account` | User info + logout |

---

## Auth flow

1. User clicks **Continue with GitHub** → `https://profile-api-zeta.vercel.app/auth/github`
2. GitHub OAuth completes, backend redirects to `/auth/callback?access_token=...&refresh_token=...`
3. Next.js API route reads tokens and sets them as **HTTP-only cookies**
4. All subsequent API calls are proxied through Next.js route handlers which inject auth headers from cookies
5. On 401, the proxy automatically refreshes the token pair and retries

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

No `.env` file required for local dev — the backend URL is hardcoded to the production API.  
For Vercel deployment, no extra env vars are needed either.

---

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Set the backend's `GITHUB_REDIRECT_URI` to:  
`https://insighta-web.vercel.app/auth/callback`

---

## CI

GitHub Actions runs on every PR to `main`:
- `npm run lint` — ESLint via `eslint-config-next`
- `npm run build` — full Next.js production build
