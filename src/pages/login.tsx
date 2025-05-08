// Login.tsx
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import useUsers from "../hooks/useUsers";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signIn, setActive, isLoaded } = useSignIn();
  const { getToken } = useAuth();
  const { authorizeUser, userActive } = useUsers();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("SUBMIT déclenché");

    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      console.log("🚧 Connexion Clerk réussie", result);

      await setActive({ session: result.createdSessionId });

      const token = await getToken();
      if (token) {
        localStorage.setItem("token", token);
        await authorizeUser();
        console.log("🚧 Utilisateur actif:", userActive);

        if (userActive && userActive.role.name === "ADMIN") {
          navigate("/users");
        }
      }
    } catch (err: any) {
      console.error("Erreur d'authentification:", err);
      setError(err.errors?.[0]?.message || "Erreur d'authentification");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e3f2fd",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 400, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
          Connexion
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextField label="Email" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          {error && (
            <Typography color="error" fontSize="0.9rem">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2, color: "white" }}>
            Se connecter
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
