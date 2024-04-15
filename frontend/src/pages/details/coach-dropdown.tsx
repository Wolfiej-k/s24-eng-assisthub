import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import type { HttpError } from "@refinedev/core"
import { useList } from "@refinedev/core"
import { type Coach } from "../../types"

interface CoachDropdownProps {
  coaches: Coach[]
  updateCoaches: (update: Coach[]) => void
  editable: boolean
}

export default function CoachDropdown({ coaches, updateCoaches, editable }: CoachDropdownProps) {
  const { data, isLoading, isError } = useList<Coach, HttpError>({
    resource: "coaches",
  })

  const coachlist = data?.data ?? []

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Something went wrong!</div>
  }

  return (
    <Autocomplete
      multiple
      id="coach-dropdown"
      options={coachlist}
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
  { name: "Alice Liu", email: "coach@coach.com" },
  { name: "Taj Jethwani-Keyser", email: "coach@coach.com" },
  { name: "Hanna Wosenu", email: "coach@coach.com" },
  { name: "Julia Poulson", email: "coach@coach.com" },
  { name: "Kaden Zheng", email: "coach@coach.com" },
  { name: "Michelle Nhung Le", email: "coach@coach.com" },
  { name: "Pedro Garcia", email: "coach@coach.com" },
]
