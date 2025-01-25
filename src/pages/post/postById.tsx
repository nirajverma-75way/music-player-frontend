import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../../services/post.api';
import PostSkeleton from '../../component/postSkeleton';
import { Box, Typography } from '@mui/material';
import PostCard from '../../component/postCard';

export default function PostById() {
    const {id} = useParams();
    const { data: posts, error, isLoading, refetch } = useGetPostByIdQuery(id);

  if (isLoading) return <PostSkeleton />;
  if (error) return <Typography variant="body1">Failed to load posts.</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      {posts.data ?(
          <PostCard data={posts.data} onReload={refetch} />

      ) : (
        <Typography variant="body1">No posts available.</Typography>
      )}
    </Box>
  );
}
