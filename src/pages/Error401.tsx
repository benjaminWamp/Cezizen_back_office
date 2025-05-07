import { Button, Typography, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Erreur401 = () => {
  return (
    <Container maxWidth="sm" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Typography variant="h1" component="h1" gutterBottom align="center" color="textPrimary">
        401
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        Oups ! Tu n'as pas l'autorisation d'accéder à cette page.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" component={Link} to="/">
          Accueil
        </Button>
      </Box>
    </Container>
  );
};

export default Erreur401;
