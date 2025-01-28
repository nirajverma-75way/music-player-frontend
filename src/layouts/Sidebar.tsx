import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Drawer,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom"; // Use NavLink for active link styling

const sidebarItems = {
  ADMIN: [
    { label: "Songs", path: "/songs" },
    { label: "Playlists", path: "/playlists" },],
  USER: [],
};

interface SidebarProps {
  role: "ADMIN" | "USER";
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const items = sidebarItems[role];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        height: "calc(100% - 64px)",
        position: "fixed",
      }}
    >
      <Typography sx={{alignSelf: "center", paddingTop: "20px"}} variant="h4" component="h6" >Music Player</Typography>
      <List sx={{ paddingTop: "10px", width: "220px" }}>
        {items.map((item) => (
          <ListItem
            button
            key={item.label}
            component={NavLink}
            to={item.path}
            activeClassName="active-link"
            sx={{
              "&.active-link": {
                backgroundColor: "primary.main",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            <ListItemText primary={item.label} sx={{ textAlign: "center" }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
