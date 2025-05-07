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
import Role from "./pages/role";
import Resource from "./pages/resource";
import Login from "./pages/login";
import Category from "./pages/category";
import StatsPage from "./pages/dashbord";
import ResourceType from "./pages/resourceType";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Erreur401 from "./pages/Error401";
import Comment from "./pages/comment";

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(document.querySelector("#header")?.clientHeight || 0);
  }, []);

  return (
    <div className="app" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
      <Routes>
        <Route path="/citizens" element={<Index />} />
        <Route path="/resources" element={<Resource />} />
        <Route path="/roles" element={<Role />} />
        <Route path="*" element={<Erreur404 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<StatsPage />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/resource-types" element={<ResourceType />} />
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Resource />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="*" element={<Erreur404 />} />
        <Route path="/401" element={<Erreur401 />} />
        <Route path="/comments" element={<Comment />} />
      </Routes>
    </div>
  );
}

export default App;
