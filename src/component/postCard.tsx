import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast } from 'react-toastify';
import { useAppSelector } from '../store/store';
import { useCreateLikeMutation, useDeleteLikeMutation } from '../services/like.api';
import { useCreateCommentMutation } from '../services/comment.api';

interface PostProps {
  id: number;
  mediaUrl?: string;
  content: string;
  like: {
    total: number;
    data: {
      _id: number;
      userId: {
        _id: number;
      };
      postId: {
        _id: number;
      }[];
    }[];
  };
  comment: {
    total: number;
    data: {
      id: string;
      content: string;
      userId: {
        id: number;
        username: string;
      };
    }[];
  };
  user: {
    id: string;
    username: string;
  };
  onReload: () => void;
}

const PostCard: React.FC<{ data: PostProps; onReload: () => void }> = ({ data, onReload }) => {
  console.log(data)
  const { _id, content, user, like, comment, mediaUrl } = data;

  const myInfo = useAppSelector((state) => JSON.parse(state.auth.user));
  const iLiked = useMemo(() => like.data.find((data) => data.userId._id === myInfo._id), [like, myInfo]);
  const [liked, setLiked] = useState(iLiked ? true : false);
  const [commentInput, setCommentInput] = useState('');
  const [createLike] = useCreateLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();
  const [createComment] = useCreateCommentMutation();

  const handleLike = async () => {
    try {
      if (liked) {
        await deleteLike({ id: iLiked?._id }).unwrap();
      } else {
        await createLike({ userId: myInfo._id, postId: _id }).unwrap();
      }
      setLiked(!liked);
      onReload(); // Trigger parent reload
    } catch (error) {
      toast.error('Error updating like.');
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await createComment({ userId: myInfo._id, postId: _id, content: commentInput }).unwrap();
      setCommentInput('');
      toast.success('Comment added successfully.');
      onReload(); // Trigger parent reload
    } catch (error) {
      toast.error('Error adding comment.');
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: '20px auto' }}>
      <CardContent>
        <Grid container alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h6">{user.username}</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2">{content}</Typography>
        {mediaUrl && (
          <CardMedia component="img" height="200" image={mediaUrl} alt="Post Image" />
        )}
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleLike}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2">{like.total} Likes</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton>
            <CommentIcon />
          </IconButton>
          <Typography variant="body2">{comment.total} Comments</Typography>
        </Box>
      </Box>
      <Box sx={{ padding: '10px' }}>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              label="Add Comment"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
              <SendIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ margin: "10px" }}>
        {comment?.data?.map((data) => {
          return (
            <Box sx={{ margin: "10px" }}>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <Typography variant="h6">{data.userId.username}</Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" component="p">
                {data.content}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};

export default PostCard;
