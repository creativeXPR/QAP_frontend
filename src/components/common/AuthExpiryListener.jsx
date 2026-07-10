import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../lib/auth";

// Mounted once inside <BrowserRouter>. Listens for the "auth:expired"
// event dispatched by apiRequest() (api/client.js) whenever an
// authenticated request comes back 401, clears the stale session, and
// bounces the user to sign-in regardless of which page they were on.
export default function AuthExpiryListener() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleExpired() {
      logout();
      navigate("/sign-in", { replace: true });
    }

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [navigate]);

  return null;
}
