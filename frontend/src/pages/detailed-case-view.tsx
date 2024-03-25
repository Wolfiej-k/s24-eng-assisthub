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

import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

interface Client {
  name: string;
  email: string;
  phone: string;
  zip: string;
  profile: string;
}

interface Coach {
  name: string;
  email: string;
}

interface Case {
  client: Client;
  coaches: Coach[];
  data: Record<string, string>;
  notes?: string;
}

interface CaseItem extends Case {
  id: number;
  startTime: Date;
  endTime?: Date;
}

interface DetailedCaseViewProps {
  eventID: number | null;
  onClose: () => void;
}

const DetailedCaseView: React.FC<DetailedCaseViewProps> = ({ eventID, onClose }) => {
  // Simulate fetching data. Replace with actual fetching logic.
  const [caseDetails, setCaseDetails] = useState<CaseItem | null>(null);

  useEffect(() => {
    // Placeholder for fetch logic
    // Here you would fetch the case details based on eventID
    // and then set it with setCaseDetails
  }, [eventID]);

  return (
    <Dialog open={!!eventID} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Case Details</DialogTitle>
      <DialogContent>
        {caseDetails && (
          <>
            <TextField
              margin="dense"
              label="Client Name"
              type="text"
              fullWidth
              variant="standard"
              value={caseDetails.client.name}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              margin="dense"
              label="Client Email"
              type="email"
              fullWidth
              variant="standard"
              value={caseDetails.client.email}
              InputProps={{
                readOnly: true,
              }}
            />
            {/* Repeat for other fields as needed */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ mt: 2 }}>
                <DateTimePicker
                  label="Start Time"
                  value={dayjs(caseDetails.startTime)}
                  onChange={() => {}}
                  renderInput={(params) => <TextField {...params} />}
                  readOnly
                />
              </Box>
            </LocalizationProvider>
            {/* Display Coaches */}
            {caseDetails.coaches.map((coach, index) => (
              <TextField
                key={index}
                margin="dense"
                label={`Coach ${index + 1} Name`}
                type="text"
                fullWidth
                variant="standard"
                value={coach.name}
                InputProps={{
                  readOnly: true,
                }}
              />
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailedCaseView;
