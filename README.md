# Shelfmark

> Free AI Shopping Readiness Score (0–100) for Shopify stores.

Shelfmark analyzes public Shopify product feeds to evaluate how clearly and accurately conversational AI shopping assistants (ChatGPT Search, Microsoft Copilot, Google AI Mode) can comprehend and recommend a merchant's catalog.

---

## Features

- **Public Feed Inspection:** Automatically fetches and audits public listings from `https://{domain}/products.json` (up to 1,000 items).
- **Rule-Based Scoring Engine:** Fast, deterministic scoring across 6 weighted signals (no AI hallucinations during grading):
  1. Title clarity (25%)
  2. Description depth (25%)
  3. Key details & specifications (20%)
  4. Product type & tags (10%)
  5. Variant & option naming (10%)
  6. Image coverage & alt text (10%)
- **"What AI Sees" Comparison:** Side-by-side view for the weakest products comparing what shoppers see vs. what language models extract.
- **Dynamic Open Graph Share Cards:** Automatic 1200×630 share card generation (`/api/og/[domain]`) for X/Reddit.
- **Waitlist Email Capture:** Built-in honeypot spam protection, zero third-party tracking, stored directly in Supabase.
- **AI Rewrite Suggestions (Optional):** Powered by Google Gemini Flash to generate sample factual rewrites with clear bracketed placeholders (`[add material]`).

---

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS v4 + Custom Design Tokens (light & dark mode)
- **Database:** Supabase (PostgreSQL) + in-memory resilient fallback
- **AI:** Google Gemini 1.5 Flash API (optional enhancement)
- **Testing:** Vitest
- **Icons:** `lucide-react`
- **Fonts:** Hanken Grotesk (`next/font`)

---

## Local Development

### 1. Clone & Install Dependencies

```bash
cd shelfmark
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Initialize Supabase Database Tables

Run the SQL statements from [`supabase-schema.sql`](./supabase-schema.sql) in your [Supabase SQL Editor](https://supabase.com/dashboard):

- `scans` (cached scans with 24-hour TTL)
- `waitlist` (email signups)
- `scan_events` (hourly IP rate limiting)
- `events` (privacy-friendly event counts)

### 4. Run Tests

```bash
pnpm vitest run
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Production Deployment

### Option A: Vercel (Recommended for simplest setup)

1. Push your repository to GitHub.
2. Import project in [Vercel Dashboard](https://vercel.com/new).
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your custom domain or vercel.app URL)
4. Deploy!

### Option B: Cloudflare Pages (OpenNext)

To deploy to Cloudflare Pages using OpenNext:

1. Install the Cloudflare OpenNext adapter:
   ```bash
   pnpm add -D @opennextjs/cloudflare wrangler
   ```
2. Build with OpenNext:
   ```bash
   npx @opennextjs/cloudflare
   ```
3. Deploy with Wrangler:
   ```bash
   npx wrangler pages deploy .open-next/assets
   ```

---

## License & Independence

Shelfmark is an independent analysis tool and is not affiliated with or endorsed by Shopify, OpenAI, Google, or Microsoft. Shopify is a registered trademark of Shopify Inc.
