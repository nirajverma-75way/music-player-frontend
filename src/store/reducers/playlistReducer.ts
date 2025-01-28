import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: PlaylistState = {
  playlists: [],
};

const songSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      console.log(action)
      state.playlists = [];
      action.payload?.map((data: Playlist) => state.playlists.push(data) )
      ;
    },
    removePlaylist: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter((playlist) => playlist._id !== action.payload);
    },
  },
});

export const { addPlaylist, removePlaylist } = songSlice.actions;

export default songSlice.reducer;
