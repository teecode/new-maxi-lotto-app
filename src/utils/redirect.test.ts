import { describe, expect, it } from "vitest";
import { normalizeRedirectTarget } from "./redirect";

describe("normalizeRedirectTarget", () => {
  // Built from the test page's own origin: jsdom's default is http://localhost:3000,
  // so a hard-coded http://localhost counted as another site.
  it("converts a same-origin absolute URL into a router-safe relative path", () => {
    expect(
      normalizeRedirectTarget(`${window.location.origin}/play?tab=1#top`, "/play"),
    ).toBe("/play?tab=1#top");
  });

  it("refuses to redirect to another site", () => {
    expect(normalizeRedirectTarget("https://evil.example/play", "/play")).toBe("/play");
  });

  it("keeps existing relative paths unchanged", () => {
    expect(normalizeRedirectTarget("/profile?tab=wallet", "/play")).toBe(
      "/profile?tab=wallet",
    );
  });

  it("falls back to the provided default when the redirect is empty", () => {
    expect(normalizeRedirectTarget("", "/play")).toBe("/play");
  });
});
