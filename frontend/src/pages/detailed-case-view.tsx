import React, { useEffect } from "react";
import { useForm, HttpError, BaseKey } from "@refinedev/core";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, DatePicker, TimePicker } from "@mui/material";

interface DetailedCaseViewProps {
  eventID: number | null;
  onClose: () => void;
}

interface IPost {
  id: BaseKey;
  title: string;
  content: string;
  hit: number;
  status: "draft" | "rejected" | "published";
  createdAt: Date;
  publishedAt: Date;
  language: number;
}

interface FormValues {
  title?: string;
  content?: string;
  hit?: number;
  status?: "draft" | "rejected" | "published";
  createdAt?: Date;
  publishedAt?: Date;
  language?: number;
}

const DetailedCaseView: React.FC<DetailedCaseViewProps> = ({ eventID, onClose }) => {
  const { queryResult, formLoading, onFinish } = useForm<IPost, HttpError, FormValues>({
    resource: "posts",
    action: "edit",
    id: eventID?.toString(),
    redirect: "show", // redirect to show page after form submission, defaults to "list"
  });

  const currentValues = queryResult?.data?.data;

  const [values, setValues] = React.useState<FormValues>({
    title: currentValues?.title,
    content: currentValues?.content,
    hit: currentValues?.hit,
    status: currentValues?.status,
    createdAt: currentValues?.createdAt,
    publishedAt: currentValues?.publishedAt,
    language: currentValues?.language,
  });

  React.useEffect(() => {
    setValues({
      title: currentValues?.title,
      content: currentValues?.content,
      hit: currentValues?.hit,
      status: currentValues?.status,
      createdAt: currentValues?.createdAt,
      publishedAt: currentValues?.publishedAt,
      language: currentValues?.language,
    });
}, [currentValues]);

  const onSubmit = (e) => {
    e.preventDefault();
    onFinish(values);
  };

  return (
    <Dialog open={!!eventID} onClose={onClose}>
        <>
          <DialogTitle>Case: {values.title}</DialogTitle>
          <DialogContent>
            <TextField label="Id" value={values.title} fullWidth />
          </DialogContent>
        </>
    </Dialog>
  );
};

export default DetailedCaseView;

