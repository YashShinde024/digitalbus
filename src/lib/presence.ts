import { createServerFn } from "@tanstack/react-start";

// In-memory presence map storing active session timestamps.
// Note: In serverless environments (like Vercel), this Map is ephemeral and local
// to each serverless function instance. For full multi-region accuracy in production,
// a persistent database or KV store (like Vercel KV / Redis) is recommended.
// This in-memory TTL implementation is the standard and safest solution supported
// by the current project architecture.
const activeSessions = new Map<string, number>();
const TIMEOUT_MS = 25000; // 25 seconds inactivity threshold

function cleanupExpired() {
  const now = Date.now();
  for (const [id, lastSeen] of activeSessions.entries()) {
    if (now - lastSeen > TIMEOUT_MS) {
      activeSessions.delete(id);
    }
  }
}

export const pingPresence = createServerFn({ method: "POST" })
  .validator((data: { clientId: string }) => data)
  .handler(async ({ data }) => {
    cleanupExpired();
    const clientId = data?.clientId;
    if (clientId) {
      activeSessions.set(clientId, Date.now());
    }
    return { onlineCount: Math.max(1, activeSessions.size) };
  });

export const disconnectPresence = createServerFn({ method: "POST" })
  .validator((data: { clientId: string }) => data)
  .handler(async ({ data }) => {
    const clientId = data?.clientId;
    if (clientId) {
      activeSessions.delete(clientId);
    }
    return { success: true };
  });
