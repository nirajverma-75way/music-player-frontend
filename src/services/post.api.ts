import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

export const apiPost = createApi({
  reducerPath: "apiPost",
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/', // Replace with your API base URL
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken; // Replace 'auth.token' with the correct path to your token in the state
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPostById: builder.query<Post, string>({
      query: (id) => `posts/${id}`,
    }),
    getPosts: builder.query({
      query: () => 'posts',
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
    }),
    updatePost: builder.mutation<Post, Partial<Post>>({
      query: (updatedPost) => ({
        url: `posts/${updatedPost.id}`,
        method: 'PUT',
        body: updatedPost,
      }),
    }),
    patchPost: builder.mutation<Post, Partial<Post>>({
      query: (updatedPost) => ({
        url: `posts/${updatedPost.id}`,
        method: 'PATCH',
        body: updatedPost,
      }),
    }),
  }),
});

export const { useGetPostByIdQuery, useGetPostsQuery, useCreatePostMutation, useUpdatePostMutation, usePatchPostMutation } = apiPost;
