import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";

export const apiUser = createApi({
  reducerPath: "apiUser",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`
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
    forgotPassword: builder.mutation<{email: string}, {email: string}>({
      query: (newUser) => ({
        url: 'users/forgot-password',
        method: 'POST',
        body: newUser,
      }),
    }),
    resetPassword: builder.mutation<{code: string, password: string, token: string}, {email: string, password: string, token: string}>({
      query: (newUser) => ({
        url: 'users/reset-password',
        method: 'POST',
        body: newUser,
        headers:{'Authorization': `Bearer ${newUser?.token}`}
      }),
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: (updatedUser) => ({
        url: `users/${updatedUser._id}`,
        method: 'PUT',
        body: updatedUser,
      }),
    }),
    patchUser: builder.mutation<User, Partial<User>>({
      query: (updatedUser) => ({
        url: `users/${updatedUser._id}`,
        method: 'PATCH',
        body: updatedUser,
      }),
    }),
  }),
});

export const { useGetUserByIdQuery, useGetUsersQuery, useCreateUserMutation, useForgotPasswordMutation, useResetPasswordMutation, useLoginUserMutation, useUpdateUserMutation, usePatchUserMutation } = apiUser;
