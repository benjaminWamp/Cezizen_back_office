import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import useUsers from "../hooks/useUsers";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { authorizeUser, userActive } = useUsers();

  useEffect(() => {
    const check = async () => {
      if (!localStorage.getItem("token")) return navigate("/login");

      authorizeUser();

      if (!userActive || userActive.role.name !== "ADMIN") {
        navigate("/login");
      }
    };

    check();
  }, [isSignedIn]);

  return <>{children}</>;
}
