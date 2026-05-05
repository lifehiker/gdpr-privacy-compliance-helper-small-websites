# External Credentials Required

This document lists all environment variables needed to run the GDPR Privacy Compliance Helper. Copy `.env.example` to `.env.local` and fill in the values below.

---

## Required — App will not start without these

### `DATABASE_URL`
SQLite file path. Works out of the box with the default value.
- Default: `file:./prisma/dev.db`
- Production (Docker): `file:/data/app.db` (already set in Dockerfile)

### `AUTH_SECRET`
Secret used to sign and verify NextAuth JWT tokens. Must be a strong random string.
- Generate with: `openssl rand -base64 32`
- Never reuse across environments.

### `NEXT_PUBLIC_APP_URL`
Your production URL (no trailing slash).
- Example: `https://privacyaudit.yourdomain.com`

---

## Stripe (optional — payments disabled without these)

The app runs fully without Stripe. Adding these keys enables subscription checkout and the billing portal.

### `STRIPE_SECRET_KEY`
Server-side secret key from the [Stripe dashboard](https://dashboard.stripe.com/apikeys).
- Format: `sk_live_...` (production) or `sk_test_...` (testing)

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
Client-side publishable key from the Stripe dashboard.
- Format: `pk_live_...` or `pk_test_...`

### `STRIPE_WEBHOOK_SECRET`
Webhook signing secret from Stripe dashboard → Developers → Webhooks.
- Create a webhook pointing to: `https://yourdomain.com/api/webhooks/stripe`
- Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Format: `whsec_...`

### `STRIPE_PRO_MONTHLY_PRICE_ID`
Stripe price ID for the Pro plan, monthly billing.
- Format: `price_...`
- Create in Stripe dashboard → Products

### `STRIPE_PRO_YEARLY_PRICE_ID`
Stripe price ID for the Pro plan, annual billing.
- Format: `price_...`

### `STRIPE_AGENCY_MONTHLY_PRICE_ID`
Stripe price ID for the Agency plan, monthly billing.
- Format: `price_...`

### `STRIPE_AGENCY_YEARLY_PRICE_ID`
Stripe price ID for the Agency plan, annual billing.
- Format: `price_...`

---

## Email via Resend (optional — emails silently skipped without these)

Welcome emails and weekly digests require Resend. The app functions without them.

### `RESEND_API_KEY`
API key from [resend.com](https://resend.com).
- Format: `re_...`

### `EMAIL_FROM`
Sender address for outgoing emails. Must be a verified domain in Resend.
- Example: `noreply@yourdomain.com`

---

## File Uploads via S3 (optional — upload endpoint returns 503 without these)

All three AWS variables must be set together or the presign endpoint returns 503.

### `AWS_ACCESS_KEY_ID`
IAM access key with `s3:PutObject` permission on the bucket.

### `AWS_SECRET_ACCESS_KEY`
Secret for the IAM access key above.

### `AWS_S3_BUCKET`
Name of the S3 bucket for storing evidence file uploads.

### `AWS_REGION`
AWS region where the bucket lives.
- Default if omitted: `us-east-1`

### `AWS_S3_ENDPOINT`
Custom endpoint URL for S3-compatible storage (e.g. Cloudflare R2, MinIO).
- Leave unset for standard AWS S3.
- Example for R2: `https://<account-id>.r2.cloudflarestorage.com`

---

## Cron Job Security

### `CRON_SECRET`
A secret token to authenticate calls to `/api/cron/weekly-digest`.
- Generate with: `openssl rand -base64 32`
- Pass as: `Authorization: Bearer <CRON_SECRET>` header from your cron provider.
- If unset, the endpoint runs without authentication (not recommended in production).
