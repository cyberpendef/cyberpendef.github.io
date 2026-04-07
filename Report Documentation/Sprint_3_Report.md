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

## Phase 3.2: Portal Login UI Development (Updated with Registration & Turnstile)

### Code Logic and Purpose Implemented
- **Files Created:**
  - `content/portal/_index.md`: Registers the `/portal` route in Hugo.
  - `layouts/portal/login.html`: The specialized layout for Identity Verification (Sign Up / Log In).
- **Logic Refinements:**
  - **Sign Up / Log In Toggle:** Replaced the Magic Link system with a robust tabbed UI allowing users to either "Sign Up" or "Log In" using an Email/Password combination.
  - **Mandatory Email Confirmation:** Configured the `signUp` logic. When a user registers, Supabase automatically sends an Email Confirmation link. This acts as initial verification. Users cannot log in until they click this email link.
  - **Turnstile Human Verification:** Integrated the Cloudflare Turnstile widget directly into both the Registration and Login flows. The CAPTCHA token is validated by Supabase Auth before processing the login request, thwarting automated credential stuffing and fake signups.
  - **Instant Redirection:** Resolved the redirect behavior. Because Email/Password login resolves synchronously (unlike Magic Links which require email checking), the user is instantly redirected to `/portal/dashboard` upon successful login.

## Phase 3.3: Client Dashboard & Route Protection

### Code Logic and Purpose Implemented
- **Files Created:**
  - `content/portal/dashboard.md`: Registers the dashboard route.
  - `layouts/portal/dashboard.html`: The authenticated client view.
- **Logic:**
  - **Strict Route Protection:** Implemented aggressive JavaScript execution at the very top of `dashboard.html`. It hides the `document.documentElement` initially, checks `supabase.auth.getSession()`, and if no valid cryptographic session exists, it executes `window.location.replace('/portal')` to instantly kick the user out. This guarantees zero unauthorized access.
  - **Secure Logout:** Implemented `supabase.auth.signOut()` to gracefully destroy the JWT token and return the user to the public portal.

### Next Steps
With the secure foundation, login, registration, and route protection completely functional, the final step for Sprint 3 is to implement the data fetching logic inside the Dashboard so clients can view their `service_tickets`.

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