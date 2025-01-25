import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

export const apiComment = createApi({
  reducerPath: "apiComment",
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
    createComment: builder.mutation({
      query: (newLike) => ({
        url: 'comments',
        method: 'POST',
        body: newLike,
      }),
    }),
  }),
});

export const { useCreateCommentMutation } = apiComment;
