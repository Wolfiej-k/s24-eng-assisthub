import React, { useEffect } from "react";
import { useForm } from "@refinedev/core";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

interface DetailedCaseViewProps {
  event: IPost | null;
  onClose: () => void;
}

interface IPost {
  id: number;
  title: string;
  content: string;
  hit: number;
  categoryID: number;
  userID: number;
  status: "draft" | "rejected" | "published";
  createdAt: Date;
  publishedAt: Date;
  language: number;
}

const DetailedCaseView: React.FC<DetailedCaseViewProps> = ({ event, onClose }) => {
  const { values, setValue } = React.useState<FormValues>;

  React.useEffect(() => {
      // Set default values when the event is available
      setValue({
        id: event?.id,
        title: event?.title,
        content: event?.content,
        hit: event?.hit,
        categoryID: event?.categoryID,
        userID: event?.userID,
        status: event?.status,
        createdAt: event?.createdAt,
        publishedAt: event?.publishedAt,
        language: event?.language,
    });
  }, [event, setValue]);

  return (
    <Dialog open={!!event} onClose={onClose}>
      {event && (
        <>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogContent>
            <TextField label="ID" value={values.id} fullWidth disabled />
            <TextField label="Title" value={values.title} fullWidth disabled />
            <TextField label="Content" value={values.content} fullWidth multiline rows={4} disabled />
            <TextField label="Date created" value={event.createdAt.toLocaleString()} fullWidth disabled />
            <TextField label="Status" value={values.status} fullWidth disabled />
            {/* Add more fields as needed */}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default DetailedCaseView;

