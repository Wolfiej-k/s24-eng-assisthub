import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { type Coach } from "../../types"
import { useEffect, useState } from "react"

interface CoachDropdownProps {
  coaches: Coach[]
  updateCoaches: (update: Coach[]) => void
  editable: boolean
}

export default function CoachDropdown({ coaches, updateCoaches, editable }: CoachDropdownProps) {
  const [coachList, setCoachList] = useState<Coach[] | null>(null)

  useEffect(() => {
    // Fetch coach data from the backend when the component mounts
    const response = await fetch('/api/coaches'); // Adjust the API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch coaches');
      }
      const coaches: Coach[] = await response.json();
      setCoachList(coaches)
  }, []);

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
  { name: "Alice Liu", email: "coach@coach.com" },
  { name: "Taj Jethwani-Keyser", email: "coach@coach.com" },
  { name: "Hanna Wosenu", email: "coach@coach.com" },
  { name: "Julia Poulson", email: "coach@coach.com" },
  { name: "Kaden Zheng", email: "coach@coach.com" },
  { name: "Michelle Nhung Le", email: "coach@coach.com" },
  { name: "Pedro Garcia", email: "coach@coach.com" },
]
