import { API_BASE_URL } from './config';

const EXTENSION_AUTH_MESSAGE = 'DSA_TRACKER_EXTENSION_AUTH';
const EXTENSION_AUTH_REQUEST = 'DSA_TRACKER_EXTENSION_AUTH_REQUEST';

export const publishExtensionAuth = (token) => {
  if (typeof window === 'undefined' || !token) return;

  window.postMessage(
    {
      source: 'DSA_TRACKER_WEB_APP',
      type: EXTENSION_AUTH_MESSAGE,
      payload: {
        token,
        apiBaseUrl: API_BASE_URL,
      },
    },
    window.location.origin
  );
};

export const clearExtensionAuth = () => {
  if (typeof window === 'undefined') return;

  window.postMessage(
    {
      source: 'DSA_TRACKER_WEB_APP',
      type: EXTENSION_AUTH_MESSAGE,
      payload: {
        token: null,
        apiBaseUrl: API_BASE_URL,
        clear: true,
      },
    },
    window.location.origin
  );
};

export const installExtensionAuthResponder = () => {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (event) => {
    if (event.source !== window) return;

    const message = event.data;
    if (!message || message.source !== 'DSA_TRACKER_EXTENSION' || message.type !== EXTENSION_AUTH_REQUEST) {
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      publishExtensionAuth(token);
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
};
