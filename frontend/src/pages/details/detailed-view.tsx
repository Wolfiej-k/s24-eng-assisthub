import DeleteIcon from "@mui/icons-material/Delete"
import { Box, Button, Chip, Divider, Grid, TextField, Typography } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import { useForm } from "@refinedev/core"
import { isEqual } from "lodash"
import { useConfirm } from "material-ui-confirm"
import { forwardRef } from "react"
import Markdown from "react-markdown"
import FileUpload, { VisuallyHiddenInput } from "../../components/file-upload"
import { type Case } from "../../types"
import BenefitsDropdown from "./benefits-dropdown"
import CloseCaseButton from "./close-case-button"
import CoachDropdown from "./coach-dropdown"

// Defining props interface for DetailedView component
interface DetailedViewProps {
  item: Case
  values: Case
  setValues: (values: Case) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  onEditingDone: () => void
}

// Main functional component for displaying detailed view
export default function DetailedView({
  item,
  values,
  setValues,
  isEditing,
  setIsEditing,
  onEditingDone,
}: DetailedViewProps) {
  const confirm = useConfirm()

  // Using the useForm hook to handle for submission
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

  // Function to handle changes in main case fields
  const handleChange = (field: keyof Case, value: unknown) => {
    setValues({ ...values, [field]: value })
  }
  // Function to handle changes in client-specific fields
  const handleClientChange = (field: keyof Case["client"], value: unknown) => {
    setValues({ ...values, client: { ...values.client, [field]: value } })
  }
  // Function to handle file upload and convert to base64
  const handleFileAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    const reader = new FileReader()

    if (file) {
      reader.onloadend = () => {
        const base64 = reader.result as string
        setValues({ ...values, files: [...values.files, { data: base64, name: file.name }] })
      }

      reader.readAsDataURL(file)
    }
  }
  // Function to handle removal  of files
  const handleFileRemove = (index: number) => {
    setValues({
      ...values,
      files: values.files.filter((_, i) => i !== index),
    })
  }
  // Funtion to truncate long file names
  const truncateFileName = (name: string) => {
    const trunc = name.split("").slice(0, 50).join("")
    if (trunc.length < name.length) {
      return trunc + "..."
    }

    return name
  }

  const startEditing = () => {
    setIsEditing(true)
  }
  // Function to cancel editing
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
  // Function to finish editing and save changes
  const finishEditing = () => {
    void onFinish(values)
  }

  return (
    <>
      <Divider /* Divider with "Client Information" label */
        variant="middle"
        sx={{
          "&::before, &::after": {
            borderColor: "primary.main",
          },
        }}
      >
        <Chip label="Client Information" size="medium" color="primary" />
      </Divider>
      <TextField
        margin="dense"
        id="clientName"
        label="Name"
        type="text"
        fullWidth
        variant="outlined"
        value={values.client.name}
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
      <Box sx={{ marginTop: 1 }}>
        <Divider /* Divider with "Case Information" label */
          variant="middle"
          sx={{
            "&::before, &::after": {
              borderColor: "primary.main",
            },
          }}
        >
          <Chip label="Case Information" size="medium" color="primary" />
        </Divider>
      </Box>
      <TextField /* Below: case information fields */
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
      <BenefitsDropdown
        benefits={values.benefits}
        updateBenefits={(update) => handleChange("benefits", update)}
        editable={isEditing}
      />
      <CoachDropdown
        coaches={values.coaches}
        updateCoaches={(update) => handleChange("coaches", update)}
        editable={isEditing}
      />
      <Box sx={{ marginTop: 1 }}>
        <Divider /* Divider with "Additional Information" label */
          variant="middle"
          sx={{
            "&::before, &::after": {
              borderColor: "primary.main",
            },
          }}
        >
          <Chip label="Additional Information" size="medium" color="primary" />
        </Divider>
      </Box>
      {Object.keys(item.data).map((field) => (
        /* Additional information fields */
        <TextField
          margin="dense"
          id={field}
          label={field
            .split(" ")
            .map((word) => word[0]?.toUpperCase() + word.substring(1))
            .join(" ")}
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
        rows={6}
        value={values.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        InputProps={
          !isEditing // If not in editing mode, apply read-only properties.
            ? {
                readOnly: true,
                inputComponent: forwardRef((_props, _ref) => (
                  // Custom input component for rendering markdown, renders notes as markdown.
                  <div style={{ whiteSpace: "pre-wrap", height: 126, width: "100%", overflowY: "auto" }}>
                    <Markdown>{values.notes ?? ""}</Markdown>
                    <VisuallyHiddenInput id="notes" />
                  </div>
                )),
              }
            : {} // If in editing mode, no additional properties are applied.
        }
      />
      <Box marginTop={1} marginBottom={2}>
        <Grid container>
          <Grid item>
            <Typography variant="h2" color="info" sx={{ paddingTop: "8px" }}>
              {values.files.length > 0 ? "Uploaded files:" : "No uploaded files."}
            </Typography>
          </Grid>
          <Grid item xs>
            <Grid container direction="row-reverse">
              <Grid item>
                <FileUpload onChange={handleFileAdd} editable={isEditing} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <List sx={{ paddingTop: "0px" }}>
          {values.files.map((value, index) => (
            <ListItem
              key={index}
              sx={{ paddingLeft: "2px" }}
              secondaryAction={
                isEditing ? (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleFileRemove(index)}>
                    <DeleteIcon />
                  </IconButton>
                ) : null
              }
            >
              <Link href={value.data} download={value.name} width="80%">
                <ListItemText primary={truncateFileName(value.name)} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
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
