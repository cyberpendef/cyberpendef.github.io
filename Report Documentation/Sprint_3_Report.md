# Sprint 3: Secure Client Portal
## Phase 3.1: Supabase Auth & Strict RLS

### Code Logic and Purpose Implemented
- **Action:** Defined the Zero-Trust authentication and authorization strategy for the Client Portal.
- **Logic:**
  - **Passwordless Authentication:** Leverages Supabase Auth's Magic Link provider. This eliminates the need for password management and protects against credential stuffing attacks.
  - **Identity-Based RLS:** Implemented a PostgreSQL Row Level Security (RLS) policy on the `service_tickets` table: `USING (auth.uid() = client_id)`. This ensures that even if an attacker gets a valid JWT (JSON Web Token), they can *only* see data where the database `client_id` matches their own cryptographically signed `UID`.
  - **Role-Based Access Control (RBAC):** Restricted `INSERT`, `UPDATE`, and `DELETE` operations on service tickets to the `service_role` only. This prevents clients from manipulating their own ticket statuses or creating fake records via the browser console.

### Next Steps
The next step is **Phase 3.2: Portal Login UI Development**. We will create a new Hugo layout (`layouts/portal/index.html`) to provide a sleek, cyberpunk-themed login interface for your clients.

## Phase 3.2: Portal Login UI Development

### Code Logic and Purpose Implemented
- **Files Created:**
  - `content/portal/_index.md`: Registers the `/portal` route in Hugo.
  - `layouts/portal/login.html`: The specialized layout for the identity verification page.
- **Logic:**
  - **Sleek, Cyberpunk UI:** Used existing CSS variables (`--card`, `--cyan`, `--border`) to ensure the login page feels native to the CyberPenDef site.
  - **Supabase JS Integration:** Embedded the Supabase Client SDK via CDN.
  - **Magic Link Logic:** Implemented `supabase.auth.signInWithOtp` which triggers a secure login email to the user. This is a passwordless approach that ensures only the owner of the email account can enter the portal.
  - **Auto-Redirect:** Added logic to check for an existing session (`supabase.auth.getSession`) and automatically redirect already logged-in clients to the dashboard.
  - **Feedback UI:** Implemented dynamic status messages (e.g., "Verifying Identity...", "✨ Identity Verified!") to provide clear user feedback during the login process.

### Next Steps
The next step is **Phase 3.3: Client Dashboard Implementation**. We will create the actual dashboard where clients can view their private service tickets and security reports.

## Phase 3.3: Client Dashboard Implementation

### Code Logic and Purpose Implemented
- **Files Created:**
  - `content/portal/dashboard.md`: Registers the `/portal/dashboard` route.
  - `layouts/portal/dashboard.html`: The authenticated dashboard view.
- **Logic:**
  - **Route Protection:** Implemented a JavaScript "gatekeeper" (`supabase.auth.getSession`) that immediately redirects unauthenticated users back to the login page if they try to access the dashboard URL directly.
  - **Dynamic Welcome:** Personalizes the dashboard by displaying the logged-in client's email address.
  - **Secure Data Fetching:** Uses the `supabase-js` library to query the `service_tickets` table. Crucially, the frontend doesn't need to filter by `client_id` manually—the **PostgreSQL Row Level Security (RLS)** policy we created in Phase 3.1 automatically filters the results at the database level based on the client's JWT.
  - **Status-Aware Rendering:** Implemented a dynamic grid that renders tickets with color-coded status badges (Pending, In Progress, Completed) and provides direct links to security reports if they are available.
  - **Secure Logout:** Implemented `supabase.auth.signOut()` logic that clears the local session and returns the user to the public portal login.

### Next Steps
Sprint 3 is complete. The next step is **Sprint 4: AI Chatbot Integration**. we will build a secure, serverless AI assistant using Groq and Supabase Edge Functions.