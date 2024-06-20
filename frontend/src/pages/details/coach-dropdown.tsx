import { Autocomplete, Box, TextField } from "@mui/material"
import { useList } from "@refinedev/core"
import { type Coach } from "../../types"

interface CoachDropdownProps {
  coaches: Coach[] // Array of selected coaches
  updateCoaches: (update: Coach[]) => void
  editable: boolean // Boolean to control if dropdown is editable
}

export default function CoachDropdown({ coaches, updateCoaches, editable }: CoachDropdownProps) {
  // Fetch list of coaches using
  const { data, isLoading, isError } = useList<Coach>({
    resource: "coaches",
  })

  if (isError) {
    return <div color="black">Something went wrong!</div>
  }

  const coachList = data?.data ?? [] // Retrieve coach list from data or use empty array if undefined

  return (
    // Render dropdown with coach list
    <Box sx={{ marginLeft: 0.25, marginRight: 0.25, marginBottom: 0.3 }}>
      <Autocomplete
        multiple
        id="coach-dropdown"
        options={coachList}
        loading={isLoading}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        value={coaches}
        onChange={(_, value) => updateCoaches(value)}
        renderInput={(params) => <TextField {...params} variant="standard" label="Coaches" />}
        style={{ paddingBottom: 4, opacity: 0.8 }}
        readOnly={!editable}
      />
    </Box>
  )
}
