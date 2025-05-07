import React from "react";
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Typography } from "@mui/material";
import { useUser, useClerk } from "@clerk/clerk-react";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut();
  };

  const getInitials = () => {
    const first = user?.firstName?.charAt(0) ?? "";
    const last = user?.lastName?.charAt(0) ?? "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ width: "100%", top: 0 }} id="header">
      <Toolbar>
        <Box sx={{ flexGrow: 1, margin: "20px 0px" }}>
          <img src="/logo.png" alt="Vivactive Logo" style={{ height: 45 }} />
        </Box>

        {isSignedIn && (
          <>
            <IconButton
              onClick={handleMenu}
              color="inherit"
              sx={{
                textTransform: "uppercase",
                borderRadius: 50,
                backgroundColor: "#00779f",
                width: 40,
                height: 40,
                color: "#fff",
              }}
            >
              <Typography variant="body1" fontWeight={600}>
                {getInitials()}
              </Typography>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
