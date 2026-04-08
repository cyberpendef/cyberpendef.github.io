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

## Phase 3.2: Portal Login & Sign Up UI Separation

### Code Logic and Purpose Implemented
- **Files Created/Modified:**
  - `content/portal/signup.md`: Registers the new `/portal/signup` route.
  - `layouts/portal/signup.html`: Dedicated registration layout with fields for **Full Name**, **Username**, Email, and Password.
  - `layouts/portal/login.html`: Simplified login-only layout with a link to the registration page.
- **Logic Refinements:**
  - **Structural Separation:** Decoupled the registration flow from the login page. This provides a cleaner User Experience (UX) and allows for more detailed data collection during registration.
  - **Metadata Enrichment:** The Sign Up logic now captures `full_name` and `username` as Supabase Auth user metadata. This allows for personalized dashboard experiences and easier client management in the Supabase dashboard.
  - **Mandatory Email Confirmation:** Maintained the `signUp` logic where users must verify their email before they can access the secure dashboard.
  - **Persistent Turnstile Protection:** Both the individual Login and Sign Up forms are independently protected by Cloudflare Turnstile to prevent automated attacks.
  - **Session Awareness:** Both pages include logic to automatically redirect already-logged-in users directly to their dashboard.

### Next Steps
The next step is **Phase 3.3: Client Dashboard Implementation**. We will now focus on populating the dashboard with real-time data from the Supabase database.

## Phase 3.3: Client Dashboard & Route Protection

### Code Logic and Purpose Implemented
- **Files Created:**
  - `content/portal/dashboard.md`: Registers the dashboard route.
  - `layouts/portal/dashboard.html`: The authenticated client view.
- **Logic:**
  - **Strict Route Protection:** Implemented aggressive JavaScript execution at the very top of `dashboard.html`. It hides the `document.documentElement` initially, checks `supabase.auth.getSession()`, and if no valid cryptographic session exists, it executes `window.location.replace('/portal')` to instantly kick the user out. This guarantees zero unauthorized access.
  - **Secure Logout:** Implemented `supabase.auth.signOut()` to gracefully destroy the JWT token and return the user to the public portal.

### Next Steps
The next step is **Phase 3.3: Client Dashboard Implementation**. We will implement the secure data fetching logic to display real-time service tickets for each client.

## Phase 3.3: Client Dashboard Implementation

### Code Logic and Purpose Implemented
- **Files Created:**
  - `content/portal/dashboard.md`: Registers the `/portal/dashboard` route.
  - `layouts/portal/dashboard.html`: The authenticated dashboard view.
- **Logic:**
  - **Route Protection:** Implemented a JavaScript "gatekeeper" (`supabase.auth.getSession`) that immediately redirects unauthenticated users back to the login page if they try to access the dashboard URL directly.
  - **Dynamic Welcome:** Personalizes the dashboard by displaying the logged-in client's email address.
  - **Secure Data Fetching:** (Planned) Uses the `supabase-js` library to query the `service_tickets` table. Crucially, the frontend doesn't need to filter by `client_id` manually—the **PostgreSQL Row Level Security (RLS)** policy we created in Phase 3.1 automatically filters the results at the database level based on the client's JWT.
  - **Status-Aware Rendering:** (Planned) Implemented a dynamic grid that renders tickets with color-coded status badges (Pending, In Progress, Completed) and provides direct links to security reports if they are available.
  - **Secure Logout:** Implemented `supabase.auth.signOut()` logic that clears the local session and returns the user to the public portal login.

### Next Steps
Sprint 3 will be complete once the dynamic data fetching logic is finalized in the Dashboard. The next sprint will be **Sprint 4: AI Chatbot Integration**.