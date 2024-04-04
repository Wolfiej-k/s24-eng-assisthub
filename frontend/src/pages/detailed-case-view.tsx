import CloseIcon from "@mui/icons-material/Close"
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material"
import { useUpdate } from "@refinedev/core"
import { useConfirm } from "material-ui-confirm"
import { useState } from "react"
import { type Case } from "../types"
import CloseCaseButton from "./close-case-button"
import CoachDropdown from "./coach-dropdown"

interface DetailedCaseViewProps {
  item: Case
  onClose: () => void
}

export default function DetailedCaseView({ item, onClose }: DetailedCaseViewProps) {
  const [notes, setNotes] = useState(item.notes)
  const [coaches, setCoaches] = useState(item.coaches)
  const [isEditing, setIsEditing] = useState(false)

  const confirm = useConfirm()
  const { mutate } = useUpdate()

  const handleClose = () => {
    if (isEditing && (item.notes != notes || item.coaches != coaches)) {
      void confirm({ title: "Discard changes?" }).then(() => onClose())
    } else {
      onClose()
    }
  }

  const startEditing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditing(true)
  }

  const cancelEdting = () => {
    if (item.notes != notes || item.coaches != coaches) {
      void confirm({ title: "Discard changes?" }).then(() => {
        setNotes(item.notes)
        setCoaches(item.coaches)
        setIsEditing(false)
      })
    } else {
      setIsEditing(false)
    }
  }

  const finishEdting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(
      {
        resource: "cases",
        values: {
          coaches: coaches,
          notes: notes,
        },
        id: item._id,
        successNotification: false,
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    )
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value)
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
          <form onSubmit={isEditing ? finishEdting : startEditing}>
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
                id="clientProfile"
                label="Profile URL"
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
              <CoachDropdown coaches={coaches} updateCoaches={(update) => setCoaches(update)} editable={isEditing} />
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
                value={notes}
                onChange={handleNotesChange}
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: 2 }}>
              {isEditing ? (
                <>
                  <div>
                    <Button variant="contained" type="submit">
                      Confirm
                    </Button>{" "}
                    <CloseCaseButton item={item} open={!item.endTime} onClose={onClose} />
                  </div>
                  <Button variant="contained" color={"error"} onClick={cancelEdting}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  {item.endTime ? (
                    <CloseCaseButton item={item} open={!item.endTime} onClose={onClose} />
                  ) : (
                    <Button variant="contained" type="submit">
                      Edit Case
                    </Button>
                  )}
                  <Button variant="contained" onClick={cancelEdting} disabled>
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
