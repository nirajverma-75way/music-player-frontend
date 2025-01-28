import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetSongsQuery } from "../../services/song.api";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addSong } from "../../store/reducers/songReducer";
import MotionButton from "../../component/motion-button";

// Form validation schema
const playlistSchema = Yup.object().shape({
  name: Yup.string().required("Playlist name is required"),
  description: Yup.string().required("Description is required"),
});

/**
 * Props interface for ManipulateDialog component.
 * 
 * @interface PlaylistDialogProps
 * @property {boolean} open - Whether the dialog is open.
 * @property {any} playlistToEdit - The playlist data to edit (if any).
 * @property {() => void} handleCloseDialog - Function to close the dialog.
 * @property {(data: Playlist) => void} handleAddEditPlaylist - Function to handle adding or editing a playlist.
 */
interface PlaylistDialogProps {
  open: boolean;
  playlistToEdit: any;
  handleCloseDialog: () => void;
  handleAddEditPlaylist: (data: Playlist) => void; // Update type to accept FormData
}

/**
 * ManipulateDialog component used for adding or editing a playlist.
 * 
 * Displays a form where users can input playlist details, select songs,
 * and save changes to the playlist.
 * 
 * @param {PlaylistDialogProps} props - The props for the dialog component.
 * @returns {JSX.Element} The ManipulateDialog component.
 */
const ManipulateDialog: React.FC<PlaylistDialogProps> = ({
  open,
  playlistToEdit,
  handleCloseDialog,
  handleAddEditPlaylist,
}) => {
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const { data: songs, error, isLoading } = useGetSongsQuery(undefined);
  const dispatch = useAppDispatch();
  const storedSongs = useAppSelector((state) => state.song.songs);

  /**
   * Effect hook to populate the Redux store with song data when it's fetched.
   */
  useEffect(() => {
    if (songs) {
      dispatch(addSong(songs.data));
    }
  }, [songs, dispatch]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(playlistSchema),
  });

  /**
   * Effect hook to set initial form values when editing an existing playlist.
   */
  useEffect(() => {
    if (playlistToEdit) {
      reset(playlistToEdit);
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [playlistToEdit, reset]);

  /**
   * Handles the selection of songs in the playlist dialog.
   * 
   * @param {React.ChangeEvent<{ value: unknown }>} event - The change event for selecting songs.
   */
  const handleSongSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value;
    setSelectedSongs(value as any[]);
  };

  /**
   * Handles saving the playlist, whether it's adding a new playlist or updating an existing one.
   * 
   * @param {Partial<Playlist>} data - The playlist data to save.
   */
  const handleSavePlaylist = (data: Partial<Playlist>) => {
    if (playlistToEdit) data._id = playlistToEdit._id;
    handleAddEditPlaylist({ ...data, songs: selectedSongs });
    setSelectedSongs([]);
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>
        {playlistToEdit ? "Edit Playlist" : "Add Playlist"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleSavePlaylist)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Playlist Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ marginBottom: 2 }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                error={!!errors.description}
                rows={4}
                helperText={errors.description?.message}
                sx={{ marginBottom: 2 }}
              />
            )}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Songs</InputLabel>
            <Select
              multiple
              value={selectedSongs}
              onChange={handleSongSelection}
              renderValue={(selected) =>
                selected.length
                  ? `${selected.length} Songs Selected`
                  : "No songs selected"
              }
            >
              {storedSongs.map((song) => (
                <MenuItem key={song._id} value={song._id}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={selectedSongs.includes(song._id)} />
                    }
                    label={song.title}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <MotionButton type="submit">
              {playlistToEdit ? "Save Changes" : "Add Playlist"}
            </MotionButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManipulateDialog;
