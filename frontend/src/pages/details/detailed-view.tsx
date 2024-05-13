import { Box, Button, Chip, Divider, TextField } from "@mui/material"
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
        .catch(() => undefined)
    }
  }
  const finishEditing = () => {
    void onFinish(values)
  }

  return (
    <>
      <Divider variant="middle">
        <Chip label="Client Information" size="medium" color="primary" />
      </Divider>
      {/* <Divider variant="middle"><Chip label="Client Information" size="medium" color="primary"/></Divider> */}
      <TextField
        margin="dense"
        id="clientName"
        label="Name"
        type="text"
        fullWidth
        variant="outlined"
        value={item.client.name}
        onChange={(e) => handleClientChange("name", e.target.value)}
        InputProps={{ readOnly: !isEditing }}
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
      <Box sx={{ marginTop: 1.5 }}>
        <Divider variant="middle">
          <Chip label="Case Information" size="medium" color="primary" />
        </Divider>
      </Box>
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
      <Box sx={{ marginTop: 1.5 }}>
        <Divider variant="middle">
          <Chip label="Additional Information" size="medium" color="primary" />
        </Divider>
      </Box>
      {/* Add extra fields here */}
      {Object.keys(item.data).map((field) => (
        <TextField
          margin="dense"
          id={field}
          label={field}
          type="text"
          fullWidth
          variant="outlined"
          value={item.data[field] ? item.data[field] : ""}
          InputProps={{
            readOnly: true,
          }}
        />
      ))}
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
      <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: 2 }}>
        {isEditing ? (
          <>
            <div>
              <Button variant="contained" onClick={finishEditing}>
                Confirm
              </Button>{" "}
              <CloseCaseButton item={item} open={true} onClose={() => void onFinish(values).then(onEditingDone)} />
            </div>
            <Button variant="contained" color={"error"} onClick={cancelEditing}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            {item.endTime ? (
              <CloseCaseButton item={item} open={false} onClose={() => undefined} />
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
