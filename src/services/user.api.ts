import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

export const apiUser = createApi({
  reducerPath: "apiUser",
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
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
    }),
    getUsers: builder.query<User, string>({
      query: () => 'users',
    }),
    createUser: builder.mutation<RegisterFormInputs, Partial<RegisterFormInputs>>({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
    }),
    loginUser: builder.mutation<LoginFormInputs, Partial<LoginFormInputs>>({
      query: (newUser) => ({
        url: 'users/login',
        method: 'POST',
        body: newUser,
      }),
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: (updatedUser) => ({
        url: `users/${updatedUser.id}`,
        method: 'PUT',
        body: updatedUser,
      }),
    }),
    patchUser: builder.mutation<User, Partial<User>>({
      query: (updatedUser) => ({
        url: `users/${updatedUser.id}`,
        method: 'PATCH',
        body: updatedUser,
      }),
    }),
  }),
});

export const { useGetUserByIdQuery, useGetUsersQuery, useCreateUserMutation, useLoginUserMutation, useUpdateUserMutation, usePatchUserMutation } = apiUser;
