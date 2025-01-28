import { createSlice, PayloadAction } from '@reduxjs/toolkit';




const initialState: SongState = {
  songs: [],
};

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    addSong: (state, action: PayloadAction<Song>) => {
      console.log(action)
      state.songs = [];
      action.payload?.map((data: Song) => state.songs.push(data) )
      ;
    },
    removeSong: (state, action: PayloadAction<string>) => {
      state.songs = state.songs.filter((song) => song._id !== action.payload);
    },
  },
});

export const { addSong, removeSong } = songSlice.actions;

export default songSlice.reducer;
