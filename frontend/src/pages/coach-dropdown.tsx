import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { useUpdate } from "@refinedev/core"
import { type Coach } from "../../../backend/src/schemas/case"

export default function CoachDropdown() {
  const { mutate } = useUpdate()

  const handleChange = (event: React.SyntheticEvent, value: Coach[]) => {
    updateCase(value)
  }

  const updateCase = (coaches: Coach[]) => {
    try {
      mutate({
        resource: "cases",
        values: {
          coaches,
        },
        id: "1",
      })
      console.log("Case updated successfully")
    } catch (error) {
      console.error("Error updating case:", error)
    }
  }

  return (
    <Autocomplete
      multiple
      id="coach-dropdown"
      options={coachList}
      getOptionLabel={(option) => option.name}
      defaultValue={[]}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} variant="standard" label="Select Coaches" />}
    />
  )
}

const coachList: Coach[] = [
  { name: "Coach Name1", email: "coach@123coach.com" },
  { name: "Coach Name2", email: "coach@123coach.com" },
  { name: "Coach Name3", email: "coach@123coach.com" },
  { name: "Coach Name4", email: "coach@123coach.com" },
  { name: "Coach Name5", email: "coach@123coach.com" },
  { name: "Coach Name6", email: "coach@123coach.com" },
  { name: "Coach Name7", email: "coach@123coach.com" },
  { name: "Coach Name8", email: "coach@123coach.com" },
  { name: "Coach Name9", email: "coach@123coach.com" },
]
