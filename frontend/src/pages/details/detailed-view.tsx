import { Box, Button, TextField } from "@mui/material"
import { useForm } from "@refinedev/core"
import { isEqual } from "lodash"
import { useConfirm } from "material-ui-confirm"
import Markdown from "react-markdown"
import { type Case } from "../../types"
import CloseCaseButton from "./close-case-button"
import CoachDropdown from "./coach-dropdown"

interface DetailedViewProps {
  item: Case
  values: Case
  setValues: (values: Case) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  onEditingDone: () => void
}

export default function DetailedView({
  item,
  values,
  setValues,
  isEditing,
  setIsEditing,
  onEditingDone,
}: DetailedViewProps) {
  const confirm = useConfirm()

  const { onFinish } = useForm<Case>({
    resource: "cases",
    action: "edit",
    id: item._id,
    redirect: false,
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

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    if (isEqual(values, item)) {
      setValues(item)
      setIsEditing(false)
    } else {
      void confirm({ title: "Discard changes?" })
        .then(() => {
          setValues(item)
          setIsEditing(false)
        })
        .catch(() => {})
    }
  }
  const finishEditing = () => {
    return onFinish(values)
  }

  return (
    <>
      <Box>
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
          rows={7}
          value={values.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          InputProps={
            !isEditing
              ? {
                  readOnly: true,
                  inputComponent: () => (
                    <div style={{ whiteSpace: "pre-wrap", height: 120, width: "100%", overflowY: "auto" }}>
                      <Markdown>{values.notes ?? ""}</Markdown>
                    </div>
                  ),
                }
              : {}
          }
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: 2 }}>
        {isEditing ? (
          <>
            <div>
              <Button variant="contained" onClick={finishEditing}>
                Confirm
              </Button>{" "}
              <CloseCaseButton item={item} open={true} onClose={() => finishEditing().then(onEditingDone)} />
            </div>
            <Button variant="contained" color={"error"} onClick={cancelEditing}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            {item.endTime ? (
              <CloseCaseButton item={item} open={false} onClose={() => {}} />
            ) : (
              <Button variant="contained" onClick={startEditing}>
                Edit Case
              </Button>
            )}
            <Button variant="contained" onClick={cancelEditing} disabled>
              Cancel
            </Button>
          </>
        )}
      </Box>
    </>
  )
}
