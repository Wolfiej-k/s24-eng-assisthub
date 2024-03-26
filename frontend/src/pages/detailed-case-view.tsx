import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Link, TextField } from "@mui/material";
import { useUpdate } from "@refinedev/core"
import { type CaseItem } from "../types"
import React, { useRef } from "react";

interface DetailedCaseViewProps {
  caseID: number;
  caseDetails: CaseItem | null;
  onClose: () => void;
}

export default function DetailedCaseView({ onClose, caseID, caseDetails }: DetailedCaseViewProps) {
  const { mutate } = useUpdate()
  const cancelRef = useRef<(() => void) | null>(null);
  const [notes, setNotes] = React.useState(caseDetails?.notes ?? '');

  const updateCase = () => {
    mutate({
      resource: "cases",
      values: {
        ...caseDetails,
        notes: notes,
      },
      id: caseID,
      meta: {
        method: "put",
      }
    }, {
        onSuccess: () => {
          setIsEditing(false);
          onClose();
        },
      });
  }

  const cancelUpdate = () => {
    cancelRef.current?.();
    setIsEditing(false);
    setNotes(caseDetails?.notes ?? '');
  };

  const [isEditing, setIsEditing] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const startEditing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  return (
    <Dialog open={!!caseDetails} onClose={onClose}>
        <>
          <DialogTitle>Case: {caseDetails?.client.name}</DialogTitle>
            <DialogContent>
              <form onSubmit={isEditing ? onSubmit : startEditing}>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        margin="dense"
                        id="id"
                        label="ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={caseDetails?.id ?? ''}
                        InputProps={{
                          readOnly: true
                        }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Start Time"
                            value={caseDetails ? dayjs(caseDetails.startTime) : null}
                            readOnly
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        id="clientName"
                        label="Client Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={caseDetails?.client.name ?? ''}
                        InputProps={{
                          readOnly: true
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="clientEmail"
                        label="Client Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={caseDetails?.client.email ?? ''}
                        InputProps={{
                          readOnly: true
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="clientPhone"
                        label="Client Phone"
                        type="tel"
                        fullWidth
                        variant="outlined"
                        value={caseDetails?.client.phone ?? ''}
                        InputProps={{
                          readOnly: true
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="clientZip"
                        label="ZIP Code"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={caseDetails?.client.zip ?? ''}
                        InputProps={{
                          readOnly: true
                        }}
                    />
                    <Typography margin="dense" variant="body1" component="div">
                            Profile URL:
                        </Typography>
                        <Link
                            href={caseDetails?.client.profile ? (caseDetails.client.profile.startsWith('https://') ? caseDetails.client.profile : `https://${caseDetails.client.profile}`) : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            display="block"
                            variant="body1"
                            style={{ marginBottom: '16px' }}
                        >
                            {caseDetails?.client.profile ?? 'Not available'}
                        </Link>
                    <TextField
                        margin="dense"
                        id="coachesNames"
                        label="Coaches"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={caseDetails?.coaches?.map(coach => coach.name).join(', ') ?? 'None'}
                        InputProps={{
                          readOnly: true
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="language"
                        label="Language"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={caseDetails?.data.language ?? ''}
                        InputProps={{
                          readOnly: true
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="benefits"
                        label="Benefits"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={caseDetails?.data.benefits ?? ''}
                        InputProps={{
                          readOnly: true
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="notes"
                        label="Notes"
                        type="text"
                        fullWidth
                        variant="outlined"
                        defaultValue={caseDetails?.notes ?? ''}
                        onChange={handleNotesChange}
                        InputProps={{
                          readOnly: !isEditing
                        }}
                    />
                </Box>
                  {isEditing? (<>
                <button onClick={updateCase}>Confirm</button>
                <button onClick={cancelUpdate}>Cancel</button>
              </>) : (<button type="submit">Edit case</button>)}
              </form>
            </DialogContent>
        </>
    </Dialog>
  );
}
