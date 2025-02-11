import { useState, useEffect } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import MotionButton from "../../component/Animation/motion-button";
import MotionBlock from "../../component/Animation/motion-block";
import ManipulateDialog from "./manipulate";
import ConfirmDeleteDialog from "./confirmDelete";
import {
  useCreateSongMutation,
  useDeleteSongMutation,
  useGetSongsQuery,
  useUpdateSongMutation,
} from "../../services/song.api";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addSong } from "../../store/reducers/songReducer";
import { toast } from "react-toastify";
import DataTable from "../../component/DataTable";

/**
 * SongsPage component for displaying a list of songs, adding new songs, editing, and deleting existing songs.
 *
 * @returns {JSX.Element} - The rendered SongsPage component.
 */

interface Column {
  field: string;
  label: string;
  type?: "text" | "audio" | "video" | "image" | "file";
}
const SongsPage = () => {
  const {
    data: songs,
    error,
    isLoading,
    refetch,
  } = useGetSongsQuery(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [songToEdit, setSongToEdit] = useState<any | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [songToDelete, setSongToDelete] = useState<any | null>(null);
  const [createSong] = useCreateSongMutation();
  const [updateSong] = useUpdateSongMutation();
  const [deleteSong] = useDeleteSongMutation();

  const dispatch = useAppDispatch();
  const storedSongs = useAppSelector((state) => state.song.songs);

  useEffect(() => {
    if (songs) {
      dispatch(addSong(songs.data));
    }
  }, [songs, dispatch]);

  /**
   * Opens the song manipulation dialog to add or edit a song.
   *
   * @param {Song} [song] - Optional song object to edit.
   */
  const handleOpenDialog = (song?: Song) => {
    setSongToEdit(song || null);
    setOpenDialog(true);
  };

  /**
   * Closes the song manipulation dialog.
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSongToEdit(null);
  };

  /**
   * Handles the process of adding or editing a song.
   *
   * @param {Song} data - The song data to be added or edited.
   */
  const handleAddEditSong = async (data: Song) => {
    if (songToEdit) {
      const response = await updateSong(data).unwrap();
      if (response?.success) {
        refetch();
        toast.success(response?.message);
      } else {
        toast.error("Something went wrong");
      }
    } else {
      const response = await createSong(data).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        refetch();
      } else {
        toast.error("Something went wrong");
      }
    }

    handleCloseDialog();
  };

  /**
   * Handles the process of deleting a song.
   */
  const handleDeleteSong = async () => {
    const response = await deleteSong(songToDelete._id).unwrap();
    if (response?.success) {
      toast.success(response?.message);
      refetch();
    } else {
      toast.error("Something went wrong");
    }
    setOpenConfirmDelete(false);
    setSongToDelete(null);
  };

  const columns: Column[] = [
    { field: "title", label: "Title" },
    { field: "artist", label: "Artist" },
    { field: "album", label: "Album" },
    { field: "genre", label: "Genre" },
    { field: "lyrics", label: "Lyrics" },
    { field: "audioUrl", label: "Audio", type: "audio" },
  ];

  return (
    <MotionBlock>
      <Box sx={{ margin: "0 auto" }}>
        <Box
          my={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom>
            Song List
          </Typography>
          <MotionButton onClick={() => handleOpenDialog()} type="submit">
            Add Songs
          </MotionButton>
        </Box>

        <DataTable
          columns={columns}
          data={storedSongs}
          isLoading={isLoading}
          onEdit={handleOpenDialog}
          onDelete={(song) => {
            setSongToDelete(song);
            setOpenConfirmDelete(true);
          }}
        />
        {/* Song Dialog */}
        <ManipulateDialog
          open={openDialog}
          songToEdit={songToEdit}
          handleCloseDialog={handleCloseDialog}
          handleAddEditSong={handleAddEditSong}
        />

        {/* Confirmation Dialog for Delete */}
        <ConfirmDeleteDialog
          open={openConfirmDelete}
          handleClose={() => setOpenConfirmDelete(false)}
          handleDeleteSong={handleDeleteSong}
        />
      </Box>
    </MotionBlock>
  );
};

export default SongsPage;
