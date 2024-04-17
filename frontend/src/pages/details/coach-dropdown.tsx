import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { useList } from "@refinedev/core"
import { type Coach } from "../../types"

interface CoachDropdownProps {
  coaches: Coach[]
  updateCoaches: (update: Coach[]) => void
  editable: boolean
}

export default function CoachDropdown({ coaches, updateCoaches, editable }: CoachDropdownProps) {
  const { data, isLoading, isError } = useList<Coach>({
    resource: "coaches",
  })

  const coachlist = data?.data ?? []

  if (isError) {
    return <div>Something went wrong!</div>
  }

  return (
    <Autocomplete
      multiple
      id="coach-dropdown"
      options={coachlist}
      loading={isLoading}
      getOptionLabel={(option) => option.name}
      value={coaches}
      onChange={(_, value) => updateCoaches(value)}
      renderInput={(params) => <TextField {...params} variant="standard" label="Coaches" />}
      style={{ paddingBottom: 4 }}
      readOnly={!editable}
    />
  )
}
