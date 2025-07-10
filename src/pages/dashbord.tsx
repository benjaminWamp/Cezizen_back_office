import React, { useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useUser } from "@clerk/clerk-react";

import useUsers from "../hooks/useUsers";
import useArticles from "../hooks/useArticles";
import useExercises from "../hooks/useExercise";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const StatsPage: React.FC = () => {
  const { fetchUsers, users, fetchUserActive } = useUsers();
  const { fetchArticles, articles } = useArticles();
  const { fetchExercises, exercises } = useExercises();
  const { user } = useUser();

  // Récupération du rôle utilisateur et log si USER
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        try {
          const userActive = await fetchUserActive(user.id);
          if (userActive?.role?.name === "USER" || userActive?.role?.name === "MODERATOR") {
            window.location.href = "/401";
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du citoyen actif :", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    // on récupère seulement les totaux
    Promise.all([fetchUsers({ page: 1, perPage: 1 }), fetchArticles({ page: 1, perPage: 1 }), fetchExercises()]);
  }, [fetchUsers, fetchArticles]);

  // Prépare les données pour le camembert
  const pieData = [
    { name: "Citoyens", value: users.total },
    { name: "Articles", value: articles.total },
    { name: "Exercices", value: exercises.total },
  ];

  // Fonction d'export CSV
  const handleExportCsv = () => {
    // 1) En-tête + lignes
    const header = ["Statut", "Nombre"];
    const rows = pieData.map((d) => [d.name, d.value.toString()]);
    const csvContent = [header, ...rows].map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\r\n") + "\r\n";

    // 2) Création du blob et du lien
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats_backoffice.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h1">Statistiques du back-office</Typography>
        <Button variant="outlined" onClick={handleExportCsv}>
          Exporter en CSV
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid component="div">
          <Card>
            <CardContent>
              <Typography>Nombre total de citoyens</Typography>
              <Typography>{users.total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid component="div">
          <Card>
            <CardContent>
              <Typography>Nombre total d'articles</Typography>
              <Typography>{articles.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid component="div">
          <Card>
            <CardContent>
              <Typography>Nombre total d'exercices</Typography>
              <Typography>{exercises.total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid component="div">
          <Card>
            <CardContent>
              <Typography gutterBottom>Répartition Citoyens vs Articles vs Exercises </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsPage;
