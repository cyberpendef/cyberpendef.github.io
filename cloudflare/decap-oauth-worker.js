/**
 * Cloudflare Worker OAuth proxy for Decap CMS GitHub authentication.
 *
 * Purpose:
 * - Decap CMS runs as a static app on GitHub Pages and cannot safely store a GitHub OAuth client secret.
 * - This Worker owns the OAuth code exchange and returns the GitHub access token to the Decap popup flow.
 *
 * Required Worker environment variables / secrets:
 * - GITHUB_CLIENT_ID: GitHub OAuth App client ID.
 * - GITHUB_CLIENT_SECRET: GitHub OAuth App client secret. Store as a Worker secret.
 * - OAUTH_STATE_SECRET: random secret used to sign state payloads. Store as a Worker secret.
 * - ALLOWED_ORIGIN: production site origin, expected to be https://cyberpendef.github.io.
 */

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const DEFAULT_ALLOWED_ORIGIN = "https://cyberpendef.github.io";
const TOKEN_SCOPE = "repo,user";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }), getAllowedOrigin(env));
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405, env);
    }

    if (url.pathname === "/auth") {
      return beginGitHubAuth(request, env);
    }

    if (url.pathname === "/callback") {
      return completeGitHubAuth(request, env);
    }

    return jsonResponse({
      status: "ok",
      service: "CyberPenDef Decap CMS OAuth proxy",
      routes: ["/auth", "/callback"],
    }, 200, env);
  },
};

async function beginGitHubAuth(request, env) {
  assertEnv(env, ["GITHUB_CLIENT_ID", "OAUTH_STATE_SECRET"]);

  const requestUrl = new URL(request.url);
  const allowedOrigin = getAllowedOrigin(env);
  const requestedOrigin = requestUrl.searchParams.get("origin") || originFromReferer(request) || allowedOrigin;
  const origin = requestedOrigin === allowedOrigin ? requestedOrigin : allowedOrigin;
  const state = await createSignedState({ origin }, env.OAUTH_STATE_SECRET);
  const redirectUri = new URL("/callback", request.url).toString();
  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);

  authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", TOKEN_SCOPE);
  authorizeUrl.searchParams.set("state", state);

  return Response.redirect(authorizeUrl.toString(), 302);
}

async function completeGitHubAuth(request, env) {
  assertEnv(env, ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "OAUTH_STATE_SECRET"]);

  const callbackUrl = new URL(request.url);
  const code = callbackUrl.searchParams.get("code");
  const state = callbackUrl.searchParams.get("state");
  const allowedOrigin = getAllowedOrigin(env);

  if (!code || !state) {
    return renderAuthResult("error", { message: "Missing OAuth code or state." }, allowedOrigin);
  }

  const stateResult = await verifySignedState(state, env.OAUTH_STATE_SECRET);
  if (!stateResult.valid) {
    return renderAuthResult("error", { message: stateResult.error || "Invalid OAuth state." }, allowedOrigin);
  }

  const origin = stateResult.payload.origin === allowedOrigin ? stateResult.payload.origin : allowedOrigin;
  const redirectUri = new URL("/callback", request.url).toString();

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "CyberPenDef-Decap-CMS-OAuth",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.access_token) {
    return renderAuthResult("error", {
      message: tokenData.error_description || tokenData.error || "GitHub token exchange failed.",
    }, origin);
  }

  return renderAuthResult("success", {
    token: tokenData.access_token,
    provider: "github",
  }, origin);
}

function renderAuthResult(status, payload, targetOrigin) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;

  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>CyberPenDef CMS Auth</title>
</head>
<body>
  <p>Completing GitHub authentication...</p>
  <script>
    (function () {
      var message = ${JSON.stringify(message)};
      var targetOrigin = ${JSON.stringify(targetOrigin)};

      if (window.opener) {
        window.opener.postMessage(message, targetOrigin);
      }

      window.close();
    })();
  </script>
</body>
</html>`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none';",
    },
  });
}

async function createSignedState(payload, secret) {
  const statePayload = {
    ...payload,
    nonce: crypto.randomUUID(),
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(statePayload));
  const signature = await sign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

async function verifySignedState(state, secret) {
  const [encodedPayload, signature] = state.split(".");
  if (!encodedPayload || !signature) {
    return { valid: false, error: "Malformed OAuth state." };
  }

  const expectedSignature = await sign(encodedPayload, secret);
  if (signature !== expectedSignature) {
    return { valid: false, error: "OAuth state signature mismatch." };
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, error: "OAuth state expired." };
  }

  return { valid: true, payload };
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));

  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function base64UrlEncode(value) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlEncodeBytes(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function assertEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Worker environment values: ${missing.join(", ")}`);
  }
}

function originFromReferer(request) {
  const referer = request.headers.get("Referer");
  if (!referer) {
    return "";
  }

  try {
    return new URL(referer).origin;
  } catch (_error) {
    return "";
  }
}

function getAllowedOrigin(env) {
  return env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
}

function jsonResponse(payload, status, env) {
  return withCors(new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  }), getAllowedOrigin(env));
}

function withCors(response, origin) {
  const headers = new Headers(response.headers);

  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
