import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";

export const apiPlaylist = createApi({
  reducerPath: "apiPlaylist",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getPlaylistById: builder.query<Playlist, string>({
      query: (id) => `playlist/${id}`,
    }),
    getPlaylists: builder.query({
      query: () => 'playlist',
    }),
    createPlaylist: builder.mutation({
      query: (newPlaylist) => ({
        url: 'playlist',
        method: 'POST',
        body: newPlaylist,
      }),
    }),
    updatePlaylist: builder.mutation({
      query: ( updatedPlaylist ) => ({        
        url: `playlist/${updatedPlaylist._id}`,
        method: 'PUT',
        body: updatedPlaylist,
      }),
    }),
    patchPlaylist: builder.mutation<Playlist, Partial<Playlist>>({
      query: (updatedPlaylist) => ({
        url: `playlist/${updatedPlaylist._id}`,
        method: 'PATCH',
        body: updatedPlaylist,
      }),
    }),
    deletePlaylist: builder.mutation<Playlist, Partial<Playlist>>({
      query: (id) => ({
        url: `playlist/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetPlaylistByIdQuery, useGetPlaylistsQuery, useCreatePlaylistMutation, useUpdatePlaylistMutation, usePatchPlaylistMutation, useDeletePlaylistMutation } = apiPlaylist;
