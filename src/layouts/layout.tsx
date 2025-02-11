// Layout.tsx (unchanged)
import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar"; // Path to your Sidebar component
import { Outlet } from "react-router-dom";

interface LayoutProps {
  role: "ADMIN" | "USER";
}

const Layout: React.FC<LayoutProps> = ({ role }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role={role}>
        <Box
          component="main"
          sx={{
            backgroundColor: "red",
            flexGrow: 1,
            bgcolor: "background.default",
            padding: 3,
          }}
        >
          <Outlet />
        </Box>
      </Sidebar>
    </Box>
  );
};

export default Layout;
