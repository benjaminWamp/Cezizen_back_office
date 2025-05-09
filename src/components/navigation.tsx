import CategoryIcon from "@mui/icons-material/Category";
import IconButton from "@mui/material/IconButton";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import GroupIcon from "@mui/icons-material/Group";
import { NavLink } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir le tableau de bord">
          <InsertChartIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/users" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les citoyens">
          <GroupIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/roles" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les rôles">
          <MilitaryTechIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/articles" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les ressources">
          <CategoryIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/exercises" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les exercices">
          <MenuBookIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/categories" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les catégories">
          <FolderIcon />
        </IconButton>
      </NavLink>
    </nav>
  );
};
export default Navigation;
