import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

export const apiLike = createApi({
  reducerPath: "apiLike",
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
    createLike: builder.mutation({
      query: (newLike) => ({
        url: 'likes',
        method: 'POST',
        body: newLike,
      }),
    }),
    deleteLike: builder.mutation<Post, Partial<Post>>({
      query: (like) => ({
        url: `likes/${like.id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useCreateLikeMutation, useDeleteLikeMutation } = apiLike;
