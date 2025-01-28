import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MotionButton from "../../component/motion-button";
import MotionBlock from "../../component/motion-block";

// Yup validation schema
const songSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  artist: Yup.string().required("Artist is required"),
  album: Yup.string().required("Album is required"),
  genre: Yup.string().required("Genre is required"),
  lyrics: Yup.string().required("Lyrics is required"),
  audioUrl: Yup.mixed().required("Audio file is required"),
});

interface SongDialogProps {
  open: boolean;
  songToEdit: any;
  handleCloseDialog: () => void;
  handleAddEditSong: (data: FormData) => void; // Update type to accept FormData
}

const ManipulateDialog: React.FC<SongDialogProps> = ({
  open,
  songToEdit,
  handleCloseDialog,
  handleAddEditSong,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(songSchema),
  });

  // Reset form when songToEdit changes
  useEffect(() => {
    if (songToEdit) {
      reset(songToEdit);
    } else {
      reset({
        title: "",
        artist: "",
        album: "",
        genre: "",
        lyrics: "",
        audioUrl: null, // Default null for file input
      });
    }
  }, [songToEdit, reset]);

  // Handle form submission and create FormData
  const onSubmit = (data: any) => {
    const formData = new FormData();

    // Append fields to FormData
    formData.append("title", data.title);
    formData.append("artist", data.artist);
    formData.append("album", data.album);
    formData.append("genre", data.genre);
    formData.append("lyrics", data.lyrics);

    if (songToEdit) {
      formData.append("id", songToEdit._id); // Append id for editing
    }

    if (data.audioUrl) {
      formData.append("audioUrl", data.audioUrl); // Append audio file
    }

    handleAddEditSong(formData); // Pass FormData to parent function
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <MotionBlock>
        <DialogTitle>{songToEdit ? "Edit Song" : "Add Song"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Controller
              name="artist"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Artist"
                  fullWidth
                  error={!!errors.artist}
                  helperText={errors.artist?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Controller
              name="album"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Album"
                  fullWidth
                  error={!!errors.album}
                  helperText={errors.album?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Controller
              name="genre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Genre"
                  fullWidth
                  error={!!errors.genre}
                  helperText={errors.genre?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Controller
              name="lyrics"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Lyrics"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Controller
              name="audioUrl"
              control={control}
              defaultValue={null} // Default value for file input
              render={({ field }) => (
                <TextField
                  {...field}
                  type="file"
                  inputProps={{ accept: ".mp3, .wav" }}
                  fullWidth
                  error={!!errors.audioUrl}
                  helperText={errors.audioUrl?.message}
                  sx={{ marginBottom: 2 }}
                  onChange={(e) => field.onChange(e.target.files?.[0] || null)} // Update field value with selected file
                />
              )}
            />

            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <MotionButton type="submit">
                {songToEdit ? "Save Changes" : "Add Song"}
              </MotionButton>
            </DialogActions>
          </form>
        </DialogContent>
      </MotionBlock>
    </Dialog>
  );
};

export default ManipulateDialog;
