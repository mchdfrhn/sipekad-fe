import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import Router from "./router/Route.jsx";
import { UserProvider } from "./utils/hooks/userContext.jsx";
import { ToastProvider } from "./utils/hooks/useToast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ToastProvider>
        <RouterProvider router={Router} />
      </ToastProvider>
    </UserProvider>
  </StrictMode>,
);
