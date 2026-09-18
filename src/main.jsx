import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import Router from "./router/Route.jsx";
import { UserProvider } from "./utils/hooks/userContext.jsx";
import { ToastProvider } from "./utils/hooks/useToast";
import ErrorBoundary from "./components/ui/ErrorBoundary.jsx";

// Auto-recover from stale chunks after production deployments
window.addEventListener("vite:preloadError", (event) => {
  console.warn(
    "[Vite] Dynamic import chunk failed to load, reloading to fetch latest assets:",
    event,
  );
  const reloadKey = "sipekad_last_chunk_reload";
  const lastReload = sessionStorage.getItem(reloadKey);
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    sessionStorage.setItem(reloadKey, now.toString());
    window.location.reload();
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <UserProvider>
        <ToastProvider>
          <RouterProvider router={Router} />
        </ToastProvider>
      </UserProvider>
    </ErrorBoundary>
  </StrictMode>,
);
