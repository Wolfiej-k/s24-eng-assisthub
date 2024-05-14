import { Checkbox } from "@mui/material"
import { useUpdate } from "@refinedev/core"
import { useConfirm } from "material-ui-confirm"
import { useState } from "react"
import { type Coach } from "../../types"

interface DeleteCoachButtonProps {
  coach: Coach
  disabled: boolean
}

export default function UpdateCoachCheckbox({ coach, disabled }: DeleteCoachButtonProps) {
  const [checked, setChecked] = useState(coach.admin)
  const { mutate } = useUpdate()
  const confirm = useConfirm()

  const handleClick = (checked: boolean) => {
    if (checked) {
      void confirm({ title: `Are you sure? This gives ${coach.name.split(" ")[0]} access to all cases.` })
        .then(() => {
          mutate(
            { resource: "coaches", values: { admin: true }, id: coach._id, successNotification: false },
            { onSuccess: () => setChecked(true) },
          )
        })
        .catch(() => setChecked(false))
    } else {
      mutate(
        { resource: "coaches", values: { admin: false }, id: coach._id, successNotification: false },
        { onSuccess: () => setChecked(false) },
      )
    }
  }

  return <Checkbox name="admin" disabled={disabled} checked={checked} onChange={(e) => handleClick(e.target.checked)} />
}
