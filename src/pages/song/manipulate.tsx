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
import MotionButton from "../../component/Animation/motion-button";
import MotionBlock from "../../component/Animation/motion-block";
import FileUploader from "../../component/FileUploader";

/**
 * Yup validation schema for song form.
 */
const songSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  artist: Yup.string().required("Artist is required"),
  album: Yup.string().required("Album is required"),
  genre: Yup.string().required("Genre is required"),
  lyrics: Yup.string().required("Lyrics is required"),
  audioUrl: Yup.mixed().required("Audio file is required"),
});

/**
 * Props for the ManipulateDialog component.
 * @typedef {Object} SongDialogProps
 * @property {boolean} open - Indicates whether the dialog is open.
 * @property {Object|null} songToEdit - The song to edit, or null for adding a new song.
 * @property {() => void} handleCloseDialog - Function to close the dialog.
 * @property {(data: FormData) => void} handleAddEditSong - Function to handle adding or editing a song.
 */
interface SongDialogProps {
  open: boolean;
  songToEdit: any;
  handleCloseDialog: () => void;
  handleAddEditSong: (data: FormData) => void;
}

/**
 * A dialog for adding or editing a song.
 *
 * @param {SongDialogProps} props - The component props.
 * @returns {JSX.Element} The rendered dialog component.
 */
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

  /**
   * Resets the form when `songToEdit` changes.
   */
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

  /**
   * Handles form submission, creating a FormData object.
   *
   * @param {Object} data - The form data.
   */
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
            {/* Title Field */}
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

            {/* Artist Field */}
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
            {/* Album Field */}
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

            {/* Genre Field */}
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

            {/* Lyrics Field */}
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
                  error={!!errors.lyrics}
                  helperText={errors.lyrics?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />

            {/* Audio File Input */}
            <Controller
              name="audioUrl"
              control={control}
              render={({ field }) => (
                <FileUploader
                  label="Audio File"
                  accept={{ "audio/*": [] }} // Accept audio file types like .mp3, .wav
                  isMultiple={false}
                  onDropFile={(acceptedFiles) => {
                    // Ensure only one file is selected
                    if (acceptedFiles?.length > 0) {
                      field.onChange(acceptedFiles[0]); // Set the first file
                    }
                  }}
                  error={!!errors.audioUrl}
                  helperText={errors.audioUrl?.message}
                />
              )}
            />

            {/* Dialog Actions */}
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
