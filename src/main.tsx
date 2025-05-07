import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, useLocation } from "react-router-dom";
import Header from "./components/header.tsx";
import Navigation from "./components/navigation.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./theme.ts";
import { ClerkProvider } from "@clerk/clerk-react";

const clerkKey = import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY;
console.log(clerkKey);
function AppWithLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      <div className="container-app">
        {!isLoginPage && <Navigation />}
        <App />
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AppWithLayout />
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
);
