# Hearth & Grain

A Next.js storefront foundation for a small home-goods shop. The brand name is intentionally easy to change later; the repository slug is currently `shopify`.

- Product catalogue and responsive shop layout
- Cart stored in `localStorage` for the prototype
- Checkout page with delivery details, order summary, and success state
- Account modal with Google sign-in handoff point
- Newsletter form and responsive mobile layout

## Production integration plan

The visible flows are intentionally ready for the following server-side adapters:

1. Supabase (recommended): use Supabase Postgres for `products`, `orders`, `order_items`, and `profiles`; use Supabase Auth with the Google provider. Keep the service-role key server-only.
2. Neon: use the same schema with a server API layer (for example, Next.js route handlers or an Express API) and Google OAuth on the server.
3. Mailgun: send the order confirmation from the server after the order transaction succeeds. Never expose the Mailgun API key in browser code.

Suggested environment variables:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
MAIL_FROM="Hearth & Grain <orders@your-domain.com>"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Run locally

Install dependencies with `npm install`, then run `npm run dev`. The current checkout success state is a front-end demo; it should be replaced by a server transaction before launch.

## Before Friday launch

- Create the repo and push the initial source.
- Add the production API/database layer and schema migrations.
- Configure Google OAuth redirect URLs in Google Cloud Console.
- Verify Mailgun domain and SPF/DKIM records.
- Add payment processing and server-side order validation before accepting real payments.
