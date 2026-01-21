export const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

export const hasNavigator = () =>
  isBrowser() && typeof navigator !== "undefined";

export const hasGeolocation = () =>
  hasNavigator() && "geolocation" in navigator;
// Storage detection
export const hasLocalStorage = () => {
  if (!isBrowser()) return false;
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const hasSessionStorage = () => {
  if (!isBrowser()) return false;
  try {
    const test = "__storage_test__";
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Device capabilities
export const hasTouchScreen = () =>
  hasNavigator() && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export const hasWebGL = () => {
  if (!isBrowser()) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
};

// Media & Permissions
export const hasCamera = () =>
  hasNavigator() &&
  typeof navigator.mediaDevices !== "undefined" &&
  typeof navigator.mediaDevices.getUserMedia !== "undefined";

export const hasNotifications = () =>
  hasNavigator() && "Notification" in window;

export const hasServiceWorker = () =>
  hasNavigator() && "serviceWorker" in navigator;

// Network
export const hasOnlineStatus = () =>
  hasNavigator() && typeof navigator.onLine === "boolean";

export const hasConnectionInfo = () =>
  hasNavigator() && "connection" in navigator;

// Device info
export const isMobile = () =>
  hasNavigator() &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

export const isIOS = () =>
  hasNavigator() && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const isAndroid = () =>
  hasNavigator() && /Android/.test(navigator.userAgent);

// Performance & Features
export const hasIntersectionObserver = () =>
  isBrowser() && "IntersectionObserver" in window;

export const hasResizeObserver = () =>
  isBrowser() && "ResizeObserver" in window;

export const hasRequestIdleCallback = () =>
  isBrowser() && "requestIdleCallback" in window;

// Clipboard
export const hasClipboard = () => hasNavigator() && "clipboard" in navigator;

// Battery
export const hasBattery = () => hasNavigator() && "getBattery" in navigator;
