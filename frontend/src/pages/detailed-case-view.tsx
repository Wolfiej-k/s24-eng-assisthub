import React from 'react';
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BaseCaseView from './base-case-view';
import { type Case } from "../types";

interface DetailedCaseViewDialogProps {
  item: Case
  onClose: () => void
}

function DetailedCaseViewDialog({ item, onClose }: DetailedCaseViewDialogProps) {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
        {item.client.name}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 16, top: 12, padding: "5%" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <BaseCaseView item={item} onEditingDone={onClose} />
    </Dialog>
  );
}

export default DetailedCaseViewDialog;
