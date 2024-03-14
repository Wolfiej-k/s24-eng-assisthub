import React from "react";
import { useForm, HttpError, BaseKey, useSelect } from "@refinedev/core";
import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
//import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Box from '@mui/material/Box';

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
  const { options } = useSelect({
    resource: "posts",
    defaultValue: queryResult?.data?.data.status,
  });

  const [values, setValues] = React.useState<FormValues>({
    title: currentValues?.title,
    content: currentValues?.content,
    hit: currentValues?.hit,
    status: currentValues?.status,
    createdAt: currentValues?.createdAt,
    publishedAt: currentValues?.publishedAt,
    language: currentValues?.language,
  });

  const [initialValues, setInitialValues] = React.useState<FormValues>({
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
    setIsEditing(false);
  };

  const [isEditing, setIsEditing] = React.useState(false);

  const startEditing = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const cancelEditing = (e) => {
    e.preventDefault();
    setValues(initialValues);
    setIsEditing(false);
  };

  return (
    <Dialog open={!!eventID} onClose={onClose}>
        <>
          <DialogTitle>Case: {values.title}</DialogTitle>
          <DialogContent>
            <label>ID: </label>
            <TextField value={eventID} fullWidth disabled/>
            <form onSubmit={isEditing ? onSubmit : startEditing} id="external-form">
            <label>Content: </label>
            <TextField fullWidth multiline rows={6} disabled={!isEditing}
              value={values.content}
              onChange={(e) => setValues({ ...values, content: e.target.value })}
            />
            <label>Created At: </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box width={300}>
                <DateTimePicker
                  disabled={!isEditing}
                  value={dayjs(values.createdAt)}
                  onChange={(date) => setValues({ ...values, createdAt: date?.toDate() })}
                />
              </Box>
            </LocalizationProvider>
            <label>Status: </label>
            <select value = {values.status} onChange={(e) => {
              const newValue: "draft" | "rejected" | "published" = e.target.value as "draft" | "rejected" | "published"
              setValues({ ...values, status: newValue })}} disabled={!isEditing}>
              <option value="published">published</option>
              <option value="draft">draft</option>
              <option value="rejected">rejected</option>
            </select>
            <br></br>
            {isEditing? (<>
              <button type="submit">Confirm</button>
              <button type="button" onClick={cancelEditing}>Cancel</button>
            </>) : (<button type="submit">Edit case</button>)}
            </form>
          </DialogContent>
        </>
    </Dialog>
  );
};

export default DetailedCaseView;

