import { Box, Card, CardContent, Skeleton } from "@mui/material";

export default function UserSkeleton() {
  return (
    <Box sx={{ padding: 2 }}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index} sx={{ maxWidth: 600, margin: "20px auto" }}>
          <CardContent>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" height={20} width="100%" />

          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
