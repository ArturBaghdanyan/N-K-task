import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React from "react";

export const CreateModal = (props: any) => {
  const {
    open,
    onClose,
    createButtonText,
    label,
    children,
    handleSubmit
  }= props

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">{label}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          {createButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
