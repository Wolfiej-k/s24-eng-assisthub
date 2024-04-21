import { Box, Button, TextField } from "@mui/material"
import { useForm } from "@refinedev/core"
import { useConfirm } from "material-ui-confirm"
import { useState } from "react"
import { type Case } from "../../types"
import CloseCaseButton from "./close-case-button"
import CoachDropdown from "./coach-dropdown"

interface DetailedViewProps {
  item: Case
  parentSetValues?: (values: Case) => void
  parentSetIsEditing?: (isEditing: boolean) => void
  onEditingDone?: () => void
}

export default function DetailedView({ item, parentSetValues, parentSetIsEditing, onEditingDone }: DetailedViewProps) {
  const [isEditing, childSetIsEditing] = useState(false)
  const [values, childSetValues] = useState<Case>(item)
  const confirm = useConfirm()

  const setIsEditing = (val: boolean) => {
    childSetIsEditing(val)
    if (parentSetIsEditing) {
      parentSetIsEditing(val)
    }
  }

  const setValues = (obj: Case) => {
    childSetValues(obj)
    if (parentSetValues) {
      parentSetValues(obj)
    }
  }

  const { onFinish } = useForm<Case>({
    resource: "cases",
    action: "edit",
    id: item._id,
    redirect: !onEditingDone ? false : "show",
    successNotification: false,
    onMutationSuccess: () => {
      setIsEditing(false)
    },
  })

  const handleChange = (field: keyof Case, value: unknown) => {
    setValues({ ...values, [field]: value })
  }

  const handleClientChange = (field: keyof Case["client"], value: unknown) => {
    setValues({ ...values, client: { ...values.client, [field]: value } })
  }

  const startEditing = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(true)
  }

  const cancelEditing = () => {
    if (values == item) {
      setValues(item)
      setIsEditing(false)
    } else {
      void confirm({ title: "Discard changes?" }).then(() => {
        setValues(item)
        setIsEditing(false)
      })
    }
  }
  const finishEditing = (e: React.FormEvent) => {
    e.preventDefault()
    void onFinish(values)
  }

  return (
    <>
      <form onSubmit={isEditing ? finishEditing : startEditing}>
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
            value={values.client.email}
            onChange={(e) => handleClientChange("email", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
          />
          <TextField
            margin="dense"
            id="clientPhone"
            label="Phone"
            type="tel"
            fullWidth
            variant="outlined"
            value={values.client.phone}
            onChange={(e) => handleClientChange("phone", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
          />
          <TextField
            margin="dense"
            id="clientZip"
            label="ZIP Code"
            type="text"
            fullWidth
            variant="outlined"
            value={values.client.zip}
            onChange={(e) => handleClientChange("zip", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
          />
          <TextField
            margin="dense"
            id="clientProfile"
            label="Profile URL"
            type="text"
            fullWidth
            variant="outlined"
            value={
              values.client.profile.startsWith("https://") ? values.client.profile : `https://${values.client.profile}`
            }
            onChange={(e) => handleClientChange("profile", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
          />
          <CoachDropdown
            coaches={values.coaches}
            updateCoaches={(update) => handleChange("coaches", update)}
            editable={isEditing}
          />
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
          <TextField
            margin="dense"
            id="endTime"
            label="End Time"
            type="text"
            fullWidth
            variant="outlined"
            value={item.endTime ? new Date(item.endTime).toLocaleString() : ""}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            id="notes"
            label="Notes"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={5}
            value={values.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: 2 }}>
          {isEditing ? (
            <>
              <div>
                <Button variant="contained" type="submit">
                  Confirm
                </Button>{" "}
                <CloseCaseButton
                  item={item}
                  open={!item.endTime}
                  onClose={onEditingDone ?? (() => setIsEditing(false))}
                />
              </div>
              <Button variant="contained" color={"error"} onClick={cancelEditing}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              {item.endTime ? (
                <CloseCaseButton
                  item={item}
                  open={!item.endTime}
                  onClose={onEditingDone ?? (() => setIsEditing(true))}
                />
              ) : (
                <Button variant="contained" type="submit">
                  Edit Case
                </Button>
              )}
              <Button variant="contained" onClick={cancelEditing} disabled>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </form>
    </>
  )
}
