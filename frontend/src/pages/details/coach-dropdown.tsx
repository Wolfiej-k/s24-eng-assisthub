import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { type Coach } from "../../types"

interface CoachDropdownProps {
  coaches: Coach[]
  updateCoaches: (update: Coach[]) => void
  editable: boolean
}

export default function CoachDropdown({ coaches, updateCoaches, editable }: CoachDropdownProps) {
  return (
    <Autocomplete
      multiple
      id="coach-dropdown"
      options={coachList}
      getOptionLabel={(option) => option.name}
      value={coaches}
      onChange={(_, value) => updateCoaches(value)}
      renderInput={(params) => <TextField {...params} variant="standard" label="Coaches" />}
      style={{ paddingBottom: 4 }}
      readOnly={!editable}
    />
  )
}

const coachList: Coach[] = [
  { name: "Alice Liu", email: "coach@coach.com", isAdmin: true},
  { name: "Taj Jethwani-Keyser", email: "coach@coach.com", isAdmin: true },
  { name: "Hanna Wosenu", email: "coach@coach.com", isAdmin: true },
  { name: "Julia Poulson", email: "coach@coach.com", isAdmin: false },
  { name: "Kaden Zheng", email: "coach@coach.com", isAdmin: false },
  { name: "Michelle Nhung Le", email: "coach@coach.com", isAdmin: false },
  { name: "Pedro Garcia", email: "coach@coach.com", isAdmin: false },
]
