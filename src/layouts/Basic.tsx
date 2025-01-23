import { Box, Theme, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { createStyles } from "@mui/styles";

const useStyle = (theme: Theme) => createStyles({
  root: {
    backgroundColor: "white",
    height: '100vh',
    width: '100vw',
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'blue', // Applied for screen width >= 600px
    },
    [theme.breakpoints.up('xl')]: {
      backgroundColor: 'green', // Applied for screen width >= 960px
    },
  },
});

const Basic = () => {
  const theme = useTheme();
  const styles = useStyle(theme);
  return (
    <Box sx={styles.root}>
   <Outlet />
      
    </Box>
  );
};

export default Basic;
