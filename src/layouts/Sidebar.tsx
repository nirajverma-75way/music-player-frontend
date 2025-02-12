import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Drawer,
  Typography,
  useMediaQuery,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom"; // Use NavLink for active link styling
import MenuIcon from "@mui/icons-material/Menu";
import theme from "../themes";

const sidebarItems = {
  ADMIN: [
    { label: "Songs", path: "/songs" },
    { label: "Playlists", path: "/playlists" },
  ],
  USER: [],
};

interface SidebarProps {
  role: "ADMIN" | "USER";
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ role, children }) => {
  const items = sidebarItems[role];

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sidebarContent = (
    <>
      <Typography
        sx={{
          alignSelf: "center",
          paddingTop: "20px",
          fontWeight: "bold",
          fontSize: "24px",
        }}
        variant="h4"
        component="h6"
      >
        Music Player
      </Typography>
      <Divider sx={{ margin: "20px 0" }} />
      <List sx={{ paddingTop: "10px" }}>
        {items.map((item) => (
          <ListItem
            button
            key={item.label}
            component={NavLink}
            to={item.path}
            activeClassName="active-link"
            sx={{
              "&.active-link": {
                backgroundColor: theme.palette.primary.main,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
              textAlign: "center",
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </>
  );

  // Mobile Sidebar
  const mobileSidebar = (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={() => setMobileOpen(true)}
        sx={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 1000,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            position: "fixed",
            top: 0,
            bottom: 0,
          },
        }}
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );

  // Desktop Sidebar
  const desktopSidebar = (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          position: "relative",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {!isMobile && desktopSidebar}
      {isMobile && mobileSidebar}
      <Box
        sx={{
          flexGrow: 1,
          padding: { sm: '20px 0', md: "20px" },
          width: '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
