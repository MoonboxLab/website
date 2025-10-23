import { useEffect, useState } from "react";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: any | null;
}

interface UseAuthSyncOptions {
  onLogin?: () => void;
  onLogout?: () => void;
  checkInterval?: number; // in milliseconds
}

export function useAuthSync(options: UseAuthSyncOptions = {}) {
  const { onLogin, onLogout, checkInterval = 2000 } = options;
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      isLoggedIn: !!token,
      token,
      user,
    };
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "user") {
        const newToken = localStorage.getItem("authToken");
        const userStr = localStorage.getItem("user");
        const newUser = userStr ? JSON.parse(userStr) : null;
        const wasLoggedIn = authState.isLoggedIn;
        const isNowLoggedIn = !!newToken;

        setAuthState({
          isLoggedIn: isNowLoggedIn,
          token: newToken,
          user: newUser,
        });

        if (!wasLoggedIn && isNowLoggedIn) {
          onLogin?.();
        } else if (wasLoggedIn && !isNowLoggedIn) {
          onLogout?.();
        }
      }
    };

    // Check localStorage periodically for mobile compatibility
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const wasLoggedIn = authState.isLoggedIn;
      const isNowLoggedIn = !!token;

      if (wasLoggedIn !== isNowLoggedIn) {
        setAuthState({
          isLoggedIn: isNowLoggedIn,
          token,
          user,
        });

        if (!wasLoggedIn && isNowLoggedIn) {
          onLogin?.();
        } else if (wasLoggedIn && !isNowLoggedIn) {
          onLogout?.();
        }
      }
    };

    // Add storage event listener (works on desktop)
    window.addEventListener("storage", handleStorageChange);

    // Add periodic check for mobile compatibility
    const intervalId = setInterval(checkAuthStatus, checkInterval);

    // Add focus event listener for when user returns to tab
    const handleFocus = () => {
      checkAuthStatus();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [authState.isLoggedIn, onLogin, onLogout, checkInterval]);

  return authState;
}
