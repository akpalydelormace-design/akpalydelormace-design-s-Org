/**
 * Intercepts global uncaught errors and unhandled promise rejections
 * to prevent benign background or SDK messages (Vite HMR/WebSocket,
 * Firestore offline retries) from appearing as blocking error overlays or crashing the app.
 */

const BENIGN_PATTERNS = [
  "vite",
  "websocket",
  "failed to connect to websocket",
  "the client is offline",
  "failed to get document from server",
  "could not reach cloud firestore backend",
  "backend didn't respond within 10 seconds",
  "networkerror",
  "load failed",
  "unhandledrejection",
  "@firebase/firestore"
];

export function setupErrorInterceptor() {
  if (typeof window === "undefined") return;

  // Prevent benign background rejections from logging as red uncaught errors
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const msg = (reason && (reason.message || String(reason)))?.toLowerCase() || "";

    const isBenign = BENIGN_PATTERNS.some((pattern) => msg.includes(pattern));
    if (isBenign) {
      console.info("[EduMentor Sync] Non-critical background event handled:", msg);
      event.preventDefault(); // Suppress unhandled promise rejection popup/overlay
    }
  });

  // Filter global window errors
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    const msg = String(message || "").toLowerCase();
    const isBenign = BENIGN_PATTERNS.some((pattern) => msg.includes(pattern));

    if (isBenign) {
      console.info("[EduMentor Sync] Suppressed benign console notice:", msg);
      return true; // Prevents default error overlay
    }

    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };
}
