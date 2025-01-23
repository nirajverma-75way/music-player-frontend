import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
  map: any;
  id: string;
  title: string;
  content: string;
}

interface PostState {
  posts: Post[];
  loading: boolean;
}

const initialState: PostState = {
  posts: [],
  loading: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<{data: {data: Post}}>) => {
      console.log(action)
      state.posts = [];
      action.payload?.data?.data?.map((data: Post) => state.posts.push(data) )
      ;
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addPost, removePost, setLoading } = postSlice.actions;

export default postSlice.reducer;
