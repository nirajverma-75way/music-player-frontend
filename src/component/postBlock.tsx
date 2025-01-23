import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Avatar,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAppSelector } from "../store/store";

interface PostProps {
  id: number;
  mediaUrl?: string;
  content: string;
  like: {
    total: number;
    data: [
      {
        _id: number;
        userId: {
          _id: number;
        } ;
        postId: [{
          _id: number;
        }] ;
      }
    ];
  };
  comment: {
    total: number;
    data: {
      [id: string]: string;
    };
  };
  user: {
    [id: string]: string;
  };
}

const PostBlock: React.FC<{ data: PostProps }> = ({ data }) => {
  console.log(data);
  const { content, user, like, comment, mediaUrl } = data;
  const [liked, setLiked] = useState(false);
  const [comments, setComment] = useState("");
  const myInfo = useAppSelector((state) => state.auth.user);
  console.log(myInfo)
  useEffect(() => {
    const iLiked = like.data.filter((data) => {
      console.log({data: data.userId._id, myInfo: myInfo._id})
      if (data.userId._id === myInfo._id) {
        return true;
      }
    });
    console.log(iLiked)
    setLiked(iLiked.length > 0 ? true : false);
  }, [myInfo]);

  const handleLike = () => {
    setLiked(!liked);
  };

  console.log(liked)

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    // Handle comment submission logic here (e.g., send to server)
    setComment("");
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "20px auto" }}>
      <CardContent>
        <Grid container alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h6">{user.username}</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" component="p">
          {content}
        </Typography>
        {mediaUrl && (
          <CardMedia
            component="img"
            height="200"
            image={mediaUrl}
            alt="Post Image"
          />
        )}
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleLike}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2">{like.total} Likes</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton>
            <CommentIcon />
          </IconButton>
          <Typography variant="body2">{comment.total} Comments</Typography>
        </Box>
      </Box>
      <Box sx={{ padding: "10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <TextField
              fullWidth
              label="Add Comment"
              value={comments}
              onChange={handleCommentChange}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
            >
              Post Comment
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default PostBlock;
