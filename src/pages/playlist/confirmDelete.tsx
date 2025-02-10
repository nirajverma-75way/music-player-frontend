import React from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  DialogContent,
} from "@mui/material";
import MotionButton from "../../component/Animation/motion-button";

/**
 * ConfirmDeleteDialog Component
 *
 * A dialog component that asks the user for confirmation before deleting a song.
 * Displays a confirmation message and two options: Cancel or Delete.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Boolean flag that controls whether the dialog is open or not.
 * @param {Function} props.handleClose - Function to handle the dialog close action.
 * @param {Function} props.handleDeleteSong - Function to handle the song deletion action when the user confirms.
 *
 * @returns {JSX.Element} The ConfirmDeleteDialog component.
 */
interface ConfirmDeleteDialogProps {
  open: boolean;
  handleClose: () => void;
  handleDeleteSong: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  handleClose,
  handleDeleteSong,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>Are you sure, you want to delete this song?</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <MotionButton onClick={handleDeleteSong}>Delete</MotionButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
