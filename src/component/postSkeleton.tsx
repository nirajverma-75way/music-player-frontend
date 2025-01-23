import { Box, Card, CardContent, Skeleton } from "@mui/material";
import React from "react";

export default function PostSkeleton() {
  return (
    <Box sx={{ padding: 2 }}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="text" height={30} width="100%" />
            <Skeleton
              variant="rectangular"
              height={100}
              sx={{ marginTop: 1 }}
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
