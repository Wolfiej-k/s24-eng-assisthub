import CloseIcon from "@mui/icons-material/Close"
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material"
import { useUpdate } from "@refinedev/core"
import { useConfirm } from "material-ui-confirm"
import { useRef, useState } from "react"
import { type Case } from "../types"
import CoachDropdown from "./coach-dropdown"

interface DetailedCaseViewProps {
  item: Case
  onClose: () => void
}

export default function DetailedCaseView({ item, onClose }: DetailedCaseViewProps) {
  const { mutate } = useUpdate()
  const confirm = useConfirm()
  const cancelRef = useRef<(() => void) | null>(null)
  const [notes, setNotes] = useState(item.notes)
  const [isEditing, setIsEditing] = useState(false)

  const handleClose = () => {
    if (isEditing) {
      void confirm({ title: "Discard changes?" }).then(() => onClose())
    } else {
      onClose()
    }
  }

  const updateCase = () => {
    mutate(
      {
        resource: "cases",
        values: {
          notes: notes,
        },
        id: item._id,
        successNotification: false,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      },
    )
  }

  const cancelUpdate = () => {
    cancelRef.current?.()
    setIsEditing(false)
    setNotes(item.notes)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditing(false)
  }

  const startEditing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditing(true)
  }

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value)
  }

  return (
    <Dialog open={true} onClose={handleClose}>
      <>
        <DialogTitle>
          {item.client.name}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 12,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
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
                value={item._id}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                id="clientEmail"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={item.client.email}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                id="clientPhone"
                label="Phone"
                type="tel"
                fullWidth
                variant="outlined"
                value={item.client.phone}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                id="clientZip"
                label="ZIP Code"
                type="text"
                fullWidth
                variant="outlined"
                value={item.client.zip}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                id="clientZip"
                label="ZIP Code"
                type="text"
                fullWidth
                variant="outlined"
                value={
                  item.client.profile.startsWith("https://") ? item.client.profile : `https://${item.client.profile}`
                }
                InputProps={{
                  readOnly: true,
                }}
              />
              <CoachDropdown item={item} editable={isEditing} />
              <TextField
                margin="dense"
                id="startTime"
                label="Start Time"
                type="text"
                fullWidth
                variant="outlined"
                value={new Date(item.startTime).toLocaleString()}
                InputProps={{
                  readOnly: true,
                }}
              />
              {item.endTime && (
                <TextField
                  margin="dense"
                  id="endTime"
                  label="End Time"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={new Date(item.endTime).toLocaleString()}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              )}
              <TextField
                margin="dense"
                id="notes"
                label="Notes"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={item.notes}
                onChange={handleNotesChange}
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: 2 }}>
              {isEditing ? (
                <>
                  <Button variant="contained" onClick={updateCase}>
                    Confirm
                  </Button>
                  <Button variant="contained" color={"error"} onClick={cancelUpdate}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" type="submit">
                    Edit Case
                  </Button>
                  <Button variant="contained" onClick={cancelUpdate} disabled>
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </form>
        </DialogContent>
      </>
    </Dialog>
  )
}
