import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [error, setError] = useState("");
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password: mdp,
      });

      await setActive({ session: result.createdSessionId });
      navigate("/resources");
    } catch (err: any) {
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
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
          Connexion
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextField label="Email" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
          <TextField label="Mot de passe" type="password" variant="outlined" value={mdp} onChange={(e) => setMdp(e.target.value)} required fullWidth />
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
