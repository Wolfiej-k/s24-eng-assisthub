import { Button } from "@mui/material"
import { useDelete } from "@refinedev/core"
import { useConfirm } from "material-ui-confirm"
import { type Coach } from "../../types"

interface DeleteCoachButtonProps {
  coach: Coach
  disabled: boolean
}

export default function DeleteCoachButton({ coach, disabled }: DeleteCoachButtonProps) {
  const { mutate } = useDelete()
  const confirm = useConfirm()

  const handleDelete = () => {
    void confirm({ title: `Are you sure? This removes ${coach.name.split(" ")[0]} from all cases.` })
      .then(() => {
        mutate(
          { resource: "coaches", id: coach._id, successNotification: false },
          { onSuccess: () => window.location.reload() },
        )
      })
      .catch(() => undefined)
  }

  return (
    <Button
      size="small"
      variant="contained"
      color="error"
      onClick={() => handleDelete()}
      sx={{ fontSize: "0.6rem" }}
      disabled={disabled}
    >
      Delete
    </Button>
  )
}
