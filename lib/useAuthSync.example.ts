// Example usage of useAuthSync hook

import { useAuthSync } from "@/lib/useAuthSync";

export function ExampleComponent() {
  const { isLoggedIn, token } = useAuthSync({
    onLogin: () => {
      console.log("User logged in!");
      // Handle login logic here
    },
    onLogout: () => {
      console.log("User logged out!");
      // Handle logout logic here
    },
    checkInterval: 3000, // Check every 3 seconds (optional, default is 2000)
  });

  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome! Token: {token}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
