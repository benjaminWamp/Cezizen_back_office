import CategoryIcon from "@mui/icons-material/Category";
import IconButton from "@mui/material/IconButton";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import GroupIcon from "@mui/icons-material/Group";
import { NavLink } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir le tableau de bord">
          <InsertChartIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/citizens" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les citoyens">
          <GroupIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/roles" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les rôles">
          <MilitaryTechIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/resources" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les ressources">
          <CategoryIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/resource-types" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les types de ressources">
          <BookmarkIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/comments" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les commentaire">
          <ModeCommentIcon />
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
