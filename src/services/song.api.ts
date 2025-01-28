import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";

export const apiSong = createApi({
  reducerPath: "apiSong",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getSongById: builder.query<Song, string>({
      query: (id) => `songs/${id}`,
    }),
    getSongs: builder.query({
      query: () => 'songs',
    }),
    createSong: builder.mutation({
      query: (newSong) => ({
        url: 'songs',
        method: 'POST',
        body: newSong,
      }),
    }),
    updateSong: builder.mutation({
      query: ( updatedSong ) => ({        
        url: `songs/${updatedSong.get("id")}`,
        method: 'PUT',
        body: updatedSong,
      }),
    }),
    patchSong: builder.mutation<Song, Partial<Song>>({
      query: (updatedSong) => ({
        url: `songs/${updatedSong._id}`,
        method: 'PATCH',
        body: updatedSong,
      }),
    }),
    deleteSong: builder.mutation<Song, Partial<Song>>({
      query: (id) => ({
        url: `songs/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetSongByIdQuery, useGetSongsQuery, useCreateSongMutation, useUpdateSongMutation, usePatchSongMutation, useDeleteSongMutation } = apiSong;
