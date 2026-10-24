import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";

import worker from "./decap-oauth-worker.js";

test("GitHub App authorization does not use classic OAuth scopes", async () => {
  const response = await worker.fetch(
    new Request("https://oauth.example.com/auth?origin=https%3A%2F%2Fcyberpendef.github.io"),
    {
      ALLOWED_ORIGIN: "https://cyberpendef.github.io",
      GITHUB_CLIENT_ID: "test-client-id",
      OAUTH_STATE_SECRET: "test-state-secret",
    },
  );
  const authorizationUrl = new URL(response.headers.get("Location"));

  assert.equal(response.status, 302);
  assert.equal(authorizationUrl.origin, "https://github.com");
  assert.equal(authorizationUrl.pathname, "/login/oauth/authorize");
  assert.equal(authorizationUrl.searchParams.get("client_id"), "test-client-id");
  assert.equal(authorizationUrl.searchParams.has("scope"), false);
});

test("GitHub callback waits for Decap's popup handshake", async () => {
  const response = await worker.fetch(
    new Request("https://oauth.example.com/callback"),
    {
      ALLOWED_ORIGIN: "https://cyberpendef.github.io",
      GITHUB_CLIENT_ID: "test-client-id",
      GITHUB_CLIENT_SECRET: "test-client-secret",
      OAUTH_STATE_SECRET: "test-state-secret",
    },
  );
  const html = await response.text();
  const script = html.match(/<script>([\s\S]*?)<\/script>/);

  assert.ok(script, "callback response should contain its popup script");

  const sentMessages = [];
  const opener = {
    postMessage(message, targetOrigin) {
      sentMessages.push({ message, targetOrigin });
    },
  };
  let messageHandler;
  let closed = false;
  const window = {
    opener,
    addEventListener(type, handler) {
      assert.equal(type, "message");
      messageHandler = handler;
    },
    removeEventListener(type, handler) {
      assert.equal(type, "message");
      assert.equal(handler, messageHandler);
      messageHandler = undefined;
    },
    close() {
      closed = true;
    },
  };

  vm.runInNewContext(script[1], {
    document: { body: { textContent: "" } },
    window,
  });

  assert.deepEqual(sentMessages, [{
    message: "authorizing:github",
    targetOrigin: "https://cyberpendef.github.io",
  }]);
  assert.ok(messageHandler, "callback should wait for the CMS handshake reply");

  messageHandler({
    origin: "https://untrusted.example",
    source: opener,
    data: "authorizing:github",
  });
  messageHandler({
    origin: "https://cyberpendef.github.io",
    source: {},
    data: "authorizing:github",
  });

  assert.equal(sentMessages.length, 1, "untrusted handshake messages should be ignored");
  assert.equal(closed, false, "popup should stay open until the CMS handshake");

  messageHandler({
    origin: "https://cyberpendef.github.io",
    source: opener,
    data: "authorizing:github",
  });

  assert.equal(sentMessages.length, 2);
  assert.match(sentMessages[1].message, /^authorization:github:error:/);
  assert.equal(sentMessages[1].targetOrigin, "https://cyberpendef.github.io");
  assert.equal(messageHandler, undefined, "handshake listener should be removed");
  assert.equal(closed, true, "popup should close after returning the auth result");
});
