import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export const useAuthRedirect = (p0: (roleName: any) => void) => {
  const { isSignedIn, isLoaded } = useUser();
 

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const currentUrl = window.location.href;
      const signInUrl = `https://healthy-pigeon-65.accounts.dev/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`;
      window.location.href = signInUrl;
    }
  }, [isLoaded, isSignedIn]);
};

