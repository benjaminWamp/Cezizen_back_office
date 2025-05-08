import { useEffect, useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import { Route, Routes } from "react-router-dom";
import Index from "./pages";
import Erreur404 from "./pages/erreur404";
import Resource from "./pages/resource";
import Login from "./pages/login";
import Category from "./pages/category";
import StatsPage from "./pages/dashbord";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Erreur401 from "./pages/Error401";
import Exercise from "./pages/exercise";
import RequireAuth from "./layout/requireAuth";

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(document.querySelector("#header")?.clientHeight || 0);
  }, []);

  return (
    <div className="app" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Index />
            </RequireAuth>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuth>
              <Index />
            </RequireAuth>
          }
        />
        <Route
          path="/articles"
          element={
            <RequireAuth>
              <Resource />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <StatsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/categories"
          element={
            <RequireAuth>
              <Category />
            </RequireAuth>
          }
        />
        <Route
          path="/exercises"
          element={
            <RequireAuth>
              <Exercise />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Erreur404 />} />
        <Route path="/401" element={<Erreur401 />} />
      </Routes>
    </div>
  );
}

export default App;
