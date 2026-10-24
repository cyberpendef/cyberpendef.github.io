# Decap CMS GitHub Blog Save 403

## Root Cause

The browser console shows Decap's GitHub backend receiving `403 Forbidden` from:

```text
POST https://api.github.com/repos/cyberpendef/cyberpendef.github.io/git/blobs
```

That operation writes a Git blob while saving content. The response message, `Resource not accessible by integration`, indicates that GitHub accepted the GitHub App user authorization but the integration does not have the required write access for this repository operation.

The live Worker's OAuth authorization redirect uses a client ID beginning with `Iv23`, identifying this as a GitHub App authorization flow. The Worker was also sending `scope=repo,user`, which is the scope model for a classic OAuth App. GitHub App access is instead controlled by the app's repository permissions, installation access, and the authorizing user's own repository permissions. The `repo` scope therefore could not provide the missing GitHub App `Contents` permission.

The source-map CSP message in the screenshot is unrelated: it blocks an optional source-map download and does not cause GitHub's `403`.

## Changes

- Removed the misleading classic OAuth `scope` parameter from `cloudflare/decap-oauth-worker.js`.
- Updated `static/admin/README.md` to describe the deployed GitHub App flow and its minimum required permissions:
  - `Contents: Read and write` for content saves.
  - `Pull requests: Read and write` for Decap's configured `editorial_workflow`.
  - `Metadata: Read-only` (automatically granted by GitHub).
- Documented repository installation access, app-owner approval, user write access, and reauthentication after changing permissions.

## Required GitHub Configuration

This repository cannot update the external GitHub App settings. In GitHub App settings:

1. Set repository permission **Contents** to **Read and write**.
2. Set repository permission **Pull requests** to **Read and write** for editorial workflow.
3. Ensure the app is installed with access to `cyberpendef.github.io`.
4. Approve any pending permission update.
5. Confirm the GitHub account used to sign into Decap has write access to the repository.
6. Sign out of Decap and sign in again, then retry saving the post.

If the integration should instead be a classic OAuth App, replace the Worker's client ID and secret with that OAuth App's credentials and keep its repository scope flow; do not mix GitHub App credentials with assumptions about classic OAuth scopes.

## Verification

The requested permissions must be granted externally before the production save can succeed. Once granted and the CMS session is refreshed, saving should pass the GitHub `POST /git/blobs` request. The code-side checks verify the generated GitHub App authorization URL no longer includes a classic OAuth scope.
