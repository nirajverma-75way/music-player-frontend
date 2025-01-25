import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useGetPostsQuery } from '../../services/post.api';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addPost } from '../../store/reducers/postReducer';
import PostSkeleton from '../../component/postSkeleton';
import PostCard from '../../component/postCard';

interface Post {
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
}

const PostList: React.FC = () => {
  const { data: posts, error, isLoading, refetch } = useGetPostsQuery(undefined);
  const dispatch = useAppDispatch();
  const storedPosts = useAppSelector((state) => state.post.posts);

  // Dispatch posts to the store when data is available
  useEffect(() => {
    if (posts) {
      dispatch(addPost(posts));
    }
  }, [posts, dispatch]);

  if (isLoading) return <PostSkeleton />;
  if (error) return <Typography variant="body1">Failed to load posts.</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      {storedPosts && storedPosts.length > 0 ? (
        storedPosts.map((postData) => (
          <PostCard key={postData.id} data={postData} onReload={refetch} />
        ))
      ) : (
        <Typography variant="body1">No posts available.</Typography>
      )}
    </Box>
  );
};

export default PostList;
