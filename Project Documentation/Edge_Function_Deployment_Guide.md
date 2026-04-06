# Guide: Deploying Supabase Edge Functions & Setting Secrets

This guide explains how to deploy the `submit-inquiry` Edge Function we created and how to securely store your API keys as environment variables in your Supabase project.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
1.  **Docker:** Required by the Supabase CLI to build and run Edge Functions locally. (Download from [docker.com](https://www.docker.com/))
2.  **Supabase CLI:** The command-line tool for managing your Supabase project.

### Installing Supabase CLI

**macOS/Linux (using Homebrew):**
```bash
brew install supabase/tap/supabase
```

**Windows (using Scoop or downloading the executable):**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```
*(Alternatively, you can install it via npm if you have Node.js installed: `npm install -g supabase`)*

---

## Step 1: Login to Supabase CLI

Open your terminal and authenticate the CLI with your Supabase account:

```bash
supabase login
```
This will open your browser and ask you to generate an Access Token. Copy the token and paste it back into your terminal.

---

## Step 2: Link Your Local Project

You need to link your local codebase to your remote Supabase project. You will need your **Reference ID**, which you can find in your Supabase Dashboard URL (e.g., `https://supabase.com/dashboard/project/YOUR_REFERENCE_ID`).

Run the following command in the root of your `cyberpendef-site` directory:

```bash
supabase link --project-ref YOUR_REFERENCE_ID
```
Enter your database password when prompted.

---

## Step 3: Set Environment Variables (Secrets)

Your Edge Function needs access to secret keys (Turnstile and Resend) to work. **Never hardcode these in your function file.** Instead, store them as encrypted secrets in Supabase.

Run the following commands in your terminal, replacing the placeholders with your actual keys:

```bash
# Set the Cloudflare Turnstile Secret Key
supabase secrets set TURNSTILE_SECRET_KEY=your_actual_turnstile_secret_key_here

# Set the Resend API Key (Optional, but required for email notifications)
supabase secrets set RESEND_API_KEY=your_actual_resend_api_key_here
```

*(Note: The `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically provided to Edge Functions by Supabase, so you don't need to set them manually).*

---

## Step 4: Deploy the Edge Function

Now that your project is linked and your secrets are set, you can deploy the function to the cloud:

```bash
supabase functions deploy submit-inquiry --no-verify-jwt
```

**Why `--no-verify-jwt`?**
By default, Supabase requires a valid user login token (JWT) to trigger an Edge Function. Because our contact form is public and used by anonymous visitors, we must disable this check. Security is instead handled inside the function by verifying the Cloudflare Turnstile token.

---

## Step 5: Verify Deployment

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Navigate to the **Edge Functions** section in the left sidebar.
3.  You should see `submit-inquiry` listed with an "Active" status.
4.  Click on the function name to view its invocation logs and execution metrics.

Your backend is now live! Ensure you update `YOUR_SUPABASE_PROJECT_URL` and `YOUR_TURNSTILE_SITE_KEY` in your `layouts/contact/list.html` file, and your dynamic contact form will be fully operational.
