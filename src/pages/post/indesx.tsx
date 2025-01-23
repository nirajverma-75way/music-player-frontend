import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Skeleton, Box } from '@mui/material';
import { useGetPostsQuery } from '../../services/post.api';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addPost } from '../../store/reducers/postReducer';
import PostSkeleton from '../../component/postSkeleton';
import PostBlock from '../../component/postBlock';

interface Post {
  id: number;
  title?: string;
  content: string;
  like: {
    total: number;
    data: {
      [id: string]: string;
    };
  };
  comment: {
    total: number;
    data: {
      [id: string]: string;
    };
  };
  user:{  }
}

const PostList: React.FC = () => {
  const { data: posts, error, isLoading } = useGetPostsQuery(undefined);
  const dispatch = useAppDispatch();
  const storedPosts = useAppSelector((state) => state.post.posts); // Assuming `state.post.posts` contains stored posts

  // Dispatch posts to the store when the data is available
  useEffect(() => {
    if (posts) {
      dispatch(addPost(posts));
    }
  }, [posts, dispatch]);

  if (isLoading) return <PostSkeleton />;

  return (
    <Box sx={{ padding: 2 }}>
      {storedPosts && storedPosts.length > 0 ? (
        storedPosts.map((postData, index) => (
          <PostBlock key={index} data={postData} />
        ))
      ) : (
        <Typography variant="body1">No posts available.</Typography>
      )}
    </Box>
  );
};

export default PostList;
