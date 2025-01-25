import { Card, Grid, CardContent, Typography, Button } from '@mui/material'

export default function UserCard({user}) {
      // Handle follow/unfollow logic
      console.log(user)
  const handleFollow = (id: number) => {

  };

  return (
    <Card sx={{ maxWidth: 600, margin: "20px auto" }}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{user?.username}
                  </Typography>
                </CardContent>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    Followers: {user?.followers}
                  </Typography>
                  <Typography variant="body2">
                    Following: {user?.following}
                  </Typography>
                </CardContent>
                <Button
                  variant={user?.isFollowing ? "outlined" : "contained"}
                  color={user?.isFollowing ? "secondary" : "primary"}
                  onClick={() => handleFollow(user.id)}
                >
                  {user?.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </Card>
            </Grid>
          </Card>
  )
}
