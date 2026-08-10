/**
 * Client-Side Presence Estimation
 * Uses BroadcastChannel to count active local tabs/sessions without requiring
 * external server function calls or triggering localhost connection errors.
 */

let channel: BroadcastChannel | null = null;
const sessionIds = new Set<string>();

export function getOnlineCount(): number {
  if (typeof window === "undefined") return 1;

  try {
    const myId =
      sessionStorage.getItem("digital_bus_client_id") ||
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem("digital_bus_client_id", myId);
    sessionIds.add(myId);

    if (!channel && typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel("digital_bus_presence");
      channel.onmessage = (event) => {
        if (event.data?.type === "ping" && event.data?.id) {
          sessionIds.add(event.data.id);
          channel?.postMessage({ type: "pong", id: myId });
        } else if (event.data?.type === "pong" && event.data?.id) {
          sessionIds.add(event.data.id);
        }
      };
      channel.postMessage({ type: "ping", id: myId });
    }
  } catch {
    // Ignore channel errors
  }

  return Math.max(1, sessionIds.size);
}
