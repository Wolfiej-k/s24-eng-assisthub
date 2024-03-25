// import React from "react";
// import { useForm, HttpError, BaseKey, useSelect } from "@refinedev/core";
// import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
// //import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// //import DatePicker from "react-datepicker";
// //import "react-datepicker/dist/react-datepicker.css";
// import dayjs from 'dayjs';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import Box from '@mui/material/Box';

// interface DetailedCaseViewProps {
//   eventID: number | null;
//   onClose: () => void;
// }

// interface IImage {
//   url: string;
//   name?: string; // Optional, add more fields as needed
//   status?: string;
//   type?: string;
//   uid?: string;
// }

// interface IPost {
//   id: BaseKey;
//   title: string;
//   content: string;
//   hit: number;
//   status: "draft" | "rejected" | "published";
//   createdAt: Date;
//   publishedAt: Date;
//   language: number;
//   image: IImage[]
// }

// interface FormValues {
//   title?: string;
//   content?: string;
//   hit?: number;
//   status?: "draft" | "rejected" | "published";
//   createdAt?: Date;
//   publishedAt?: Date;
//   language?: number;
//   image?: IImage[]
// }

// const DetailedCaseView: React.FC<DetailedCaseViewProps> = ({ eventID, onClose }) => {
//   const { queryResult, formLoading, onFinish } = useForm<IPost, HttpError, FormValues>({
//     resource: "posts",
//     action: "edit",
//     id: eventID?.toString(),
//     redirect: "show", // redirect to show page after form submission, defaults to "list"
//   });

//   const currentValues = queryResult?.data?.data;

//   const [values, setValues] = React.useState<FormValues>({
//     title: currentValues?.title,
//     content: currentValues?.content,
//     hit: currentValues?.hit,
//     status: currentValues?.status,
//     createdAt: currentValues?.createdAt,
//     publishedAt: currentValues?.publishedAt,
//     language: currentValues?.language,
//     image: currentValues?.image
//   });

//   const [initialValues, setInitialValues] = React.useState<FormValues>({
//     title: currentValues?.title,
//     content: currentValues?.content,
//     hit: currentValues?.hit,
//     status: currentValues?.status,
//     createdAt: currentValues?.createdAt,
//     publishedAt: currentValues?.publishedAt,
//     language: currentValues?.language,
//     image: currentValues?.image
//   });

//   React.useEffect(() => {
//     setValues({
//       title: currentValues?.title,
//       content: currentValues?.content,
//       hit: currentValues?.hit,
//       status: currentValues?.status,
//       createdAt: currentValues?.createdAt,
//       publishedAt: currentValues?.publishedAt,
//       language: currentValues?.language,
//       image: currentValues?.image
//     });
// }, [eventID, currentValues]);

//   const onSubmit = (e) => {
//     e.preventDefault();
//     onFinish(values);
//     setIsEditing(false);
//   };

//   const [isEditing, setIsEditing] = React.useState(false);

//   const startEditing = (e) => {
//     e.preventDefault();
//     setIsEditing(true);
//   };

//   const cancelEditing = (e) => {
//     e.preventDefault();
//     setValues(initialValues);
//     setIsEditing(false);
//   };

//   return (
//     <Dialog open={!!eventID} onClose={onClose}>
//         <>
//           <DialogTitle>Case: {values.title}</DialogTitle>
//           <DialogContent>
//             <label>ID: </label>
//             <TextField value={eventID} fullWidth disabled/>
//             <form onSubmit={isEditing ? onSubmit : startEditing} id="external-form">
//             <label>Content: </label>
//             <TextField fullWidth multiline rows={6} disabled={!isEditing}
//               value={values.content}
//               onChange={(e) => setValues({ ...values, content: e.target.value })}
//             />
//             <label>Created At: </label>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <Box width={300}>
//                 <DateTimePicker
//                   disabled={!isEditing}
//                   value={dayjs(values.createdAt)}
//                   onChange={(date) => setValues({ ...values, createdAt: date?.toDate() })}
//                 />
//               </Box>
//             </LocalizationProvider>
//             <label>Status: </label>
//             <select value = {values.status} onChange={(e) => {
//               const newValue: "draft" | "rejected" | "published" = e.target.value as "draft" | "rejected" | "published"
//               setValues({ ...values, status: newValue })}} disabled={!isEditing}>
//               <option value="published">published</option>
//               <option value="draft">draft</option>
//               <option value="rejected">rejected</option>
//             </select>
//             {values.image && (
//               <>
//                 <br />
//                 <label>Image: </label>
//                 <br />

//                 <img
//                   src={values.image[0].url}
//                   width={200}
//                   height={200}
//                 />
//                 <br />
//                 <br />
//               </>
//             )}
//             {isEditing? (<>
//               <button type="submit">Confirm</button>
//               <button type="button" onClick={cancelEditing}>Cancel</button>
//             </>) : (<button type="submit">Edit case</button>)}
//             </form>
//           </DialogContent>
//         </>
//     </Dialog>
//   );
// };

// export default DetailedCaseView;

import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useList } from "@refinedev/core"; // Assuming useList is imported from here or adjust the import based on actual location
import DetailedCaseView from "./detailed-case-view";
import { type CaseItem, type Coach } from "../types"
import CoachDropdown from "./coach-dropdown";

export default function DetailedCaseView({ CaseItem, onClose }) {
  const [selectedEventID, setSelectedEventID] = useState<number | null>(null);
  const [isOpen, setOpenDialog] = useState(false);
  const { data: casesData } = useList<CaseItem>({ resource: "cases" });

  const handleOpenDialog = (eventId: number) => {
    setSelectedEventID(eventId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedEventID(null);
    setOpenDialog(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 75 },
    {
      field: "clientName",
      headerName: "Client Name",
      width: 200,
      valueGetter: ({ row }) => row.client.name,
    },
    {
      field: "clientEmail",
      headerName: "Client Email",
      width: 200,
      valueGetter: ({ row }) => row.client.email,
    },
    {
      field: "language",
      headerName: "Language",
      width: 120,
      valueGetter: ({ row }) => row.data.language,
    },
    {
      field: "benefits",
      headerName: "Benefits",
      width: 200,
      valueGetter: ({ row }) => row.data.benefits,
    },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 150,
      valueGetter: ({ row }) => new Date(row.startTime).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <button onClick={() => handleOpenDialog(params.row.id)}>View Details</button>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={casesData || []}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
      />
      {selectedEventID && (
        <DetailedCaseView eventID={selectedEventID} onClose={handleCloseDialog} />
      )}
    </div>
  );
}

