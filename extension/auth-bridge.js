console.log("DSA Tracker auth bridge connected");

const AUTH_MESSAGE_TYPE = "DSA_TRACKER_EXTENSION_AUTH";
const AUTH_REQUEST_TYPE = "DSA_TRACKER_EXTENSION_AUTH_REQUEST";
const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://dsa-tracker-murex.vercel.app",
  "https://dsa-tracker-git-main-palaks-projects-09ea9c07.vercel.app",
]);

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!ALLOWED_ORIGINS.has(event.origin)) return;

  const message = event.data;
  if (!message || message.source !== "DSA_TRACKER_WEB_APP" || message.type !== AUTH_MESSAGE_TYPE) {
    return;
  }

  const { token, apiBaseUrl, clear } = message.payload || {};

  if (clear) {
    chrome.storage.local.remove(["dsaTrackerToken", "dsaTrackerApiBaseUrl"], () => {
      console.log("DSA Tracker extension auth cleared");
    });
    return;
  }

  if (typeof token !== "string" || !token.trim()) {
    return;
  }

  chrome.storage.local.set(
    {
      dsaTrackerToken: token,
      dsaTrackerApiBaseUrl: apiBaseUrl || "http://localhost:5050",
    },
    () => {
      console.log("DSA Tracker extension auth updated");
    }
  );
});

window.postMessage(
  {
    source: "DSA_TRACKER_EXTENSION",
    type: AUTH_REQUEST_TYPE,
  },
  window.location.origin
);
