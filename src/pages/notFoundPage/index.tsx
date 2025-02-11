import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-evenly"
            height="80vh"
            textAlign="center"
            px={2}
        >
            {/* Animated 404 Text - Floating Effect */}
            <Typography
                component={motion.h1}
                fontSize="5rem"
                fontWeight="bold"
                color="primary"
                sx={{ zIndex: 2 }}
                gutterBottom
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >

            </Typography>

            {/* Bouncing Image */}
            <Box
                component={motion.img}
                src="https://cdn.svgator.com/images/2024/04/detective-animation-404-error-page.gif"
                alt="404 Illustration"
                width={'60%'}
                sx={{ position: 'absolute' }}
                mb={2}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />


            {/* Subtext with Subtle Shake Effect */}
            <Typography
                component={motion.p}
                variant="h5"
                color="textSecondary"
                animate={{ rotate: [-1, 1, -1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >

            </Typography>

            {/* Vibrating Back Button */}
            <Button
                component={motion.button}
                variant="contained"
                color="primary"
                sx={{ mt: 3, px: 4, py: 1 }}
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.1 }}
                animate={{ x: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
            >
                Back to Home
            </Button>
        </Box>
    );
};

export default NotFoundPage;
