import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";

interface HeaderGridProps {
  title: string;
  onAddClick?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

function HeaderGrid({ title, onAddClick, searchValue, onSearchChange }: HeaderGridProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", margin: "20px 0", width: "100%", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="h1" sx={{ paddingBottom: "10px" }}>
        {title}
      </Typography>
      <TextField
        label="Rechercher"
        variant="outlined"
        size="small"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 240, flex: 1 }}
      />
      {onAddClick && (
        <Button variant="contained" onClick={onAddClick}>
          Ajouter
        </Button>
      )}
    </Box>
  );
}

export default HeaderGrid;
