import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Grid,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ManipulateDialog from "./manipulate"; // Import the ManipulateDialog component
import MotionBlock from "../../component/motion-block";
import MotionButton from "../../component/motion-button";
import TableSkeleton from "../../component/table-skeleton";
import {
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useGetPlaylistsQuery,
  useUpdatePlaylistMutation,
} from "../../services/playlist.api";
import { addPlaylist } from "../../store/reducers/playlistReducer";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/store";
import { toast } from "react-toastify";
import ConfirmDeleteDialog from "./confirmDelete";

/**
 * PlaylistPage Component
 * 
 * Displays the list of playlists, allows users to add, edit, and delete playlists.
 * Also handles the interactions with the backend API for managing playlists.
 * 
 * @returns {JSX.Element} The PlaylistPage component with functionalities to add, edit, and delete playlists.
 */
const PlaylistPage = () => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState<any | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<any | null>(null);
  const [createPlaylist] = useCreatePlaylistMutation();
  const [updatePlaylist] = useUpdatePlaylistMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const {
    data: playlist,
    error,
    isLoading,
    refetch,
  } = useGetPlaylistsQuery(undefined);

  const storedPlaylist = useAppSelector((state) => state.playlist.playlists);

  /**
   * Effect hook to update the store with playlists when data is available.
   */
  useEffect(() => {
    if (playlist) {
      dispatch(addPlaylist(playlist.data));
    }
  }, [playlist, dispatch]);

  /**
   * Opens the dialog for adding or editing a playlist.
   * 
   * @param {Playlist} [playlist] - The playlist to edit (optional).
   */
  const handleOpenDialog = (playlist?: Playlist) => {
    setPlaylistToEdit(playlist || null);
    setOpenDialog(true);
  };

  /**
   * Closes the playlist dialog.
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPlaylistToEdit(null);
  };

  /**
   * Handles adding or editing a playlist.
   * 
   * @param {Playlist} data - The playlist data to add or update.
   */
  const handleAddEditPlaylist = async (data: Playlist) => {
    if (playlistToEdit) {
      const response = await updatePlaylist(data).unwrap();
      if (response?.success) {
        refetch();
        toast.success(response?.message);
      } else {
        toast.error("Something went wrong");
      }
    } else {
      const response = await createPlaylist(data).unwrap();
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
   * Handles deleting a playlist after confirmation.
   */
  const handleDeleteSong = async () => {
    const response = await deletePlaylist(playlistToDelete._id).unwrap();
    if (response?.success) {
      toast.success(response?.message);
      refetch();
    } else {
      toast.error("Something went wrong");
    }
    setOpenConfirmDelete(false);
    setPlaylistToDelete(null);
  };

  return (
    <MotionBlock>
      <Box px={3} sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Box
          my={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom>
            Playlist
          </Typography>
          <MotionButton onClick={() => handleOpenDialog()} type="submit">
            Add Playlist
          </MotionButton>
        </Box>

        {isLoading && <TableSkeleton column={3} />}
        {!isLoading && (
          <Grid container spacing={2}>
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 3, borderRadius: 2 }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="playlist table">
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Playlist Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storedPlaylist.map((playlist) => (
                    <TableRow key={playlist._id}>
                      <TableCell>{playlist.name}</TableCell>
                      <TableCell>{playlist.description}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog(playlist)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => {
                              setPlaylistToDelete(playlist);
                              setOpenConfirmDelete(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {storedPlaylist.length === 0 && (
                <Typography
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ justifySelf: "center", padding: "10px" }}
                >
                  No Playlist available
                </Typography>
              )}
            </TableContainer>
          </Grid>
        )}

        {/* Playlist Dialog Component */}
        <ManipulateDialog
          open={openDialog}
          playlistToEdit={playlistToEdit}
          handleCloseDialog={handleCloseDialog}
          handleAddEditPlaylist={handleAddEditPlaylist}
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

export default PlaylistPage;
