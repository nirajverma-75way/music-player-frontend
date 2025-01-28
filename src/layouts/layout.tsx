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
      <Sidebar role={role} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          padding: 3,
          marginLeft: "250px", // Ensure this aligns with your sidebar width
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
