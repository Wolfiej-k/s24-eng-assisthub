import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { useUpdate } from "@refinedev/core"
import { type Case, type Coach } from "../types"

interface CoachDropdownProps {
  item: Case
  editable: boolean
}

export default function CoachDropdown({ item, editable }: CoachDropdownProps) {
  const { mutate } = useUpdate()

  const updateCase = (coaches: Coach[]) => {
    mutate({
      resource: "cases",
      values: {
        coaches: coaches,
      },
      id: item._id,
      successNotification: false,
    })
  }

  return (
    <Autocomplete
      multiple
      id="coach-dropdown"
      options={coachList}
      getOptionLabel={(option) => option.name}
      defaultValue={item.coaches}
      onChange={(_, value) => updateCase(value)}
      renderInput={(params) => <TextField {...params} variant="standard" label="Coaches" />}
      style={{ paddingBottom: 4 }}
      readOnly={!editable}
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
