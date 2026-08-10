import { createServerFn } from "@tanstack/react-start";

// In-memory presence map storing active session timestamps
const activeSessions = new Map<string, number>();
const TIMEOUT_MS = 15000; // 15 seconds inactivity threshold

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
    if (data?.clientId) {
      activeSessions.set(data.clientId, Date.now());
    }
    return { onlineCount: Math.max(1, activeSessions.size) };
  });
