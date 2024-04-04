import { Button } from "@mui/material"
import { useUpdate } from "@refinedev/core"
import { useConfirm } from "material-ui-confirm"
import { type Case } from "../types"

interface CloseCaseButtonProps {
  item: Case
  open: boolean
  onClose: () => void
}

export default function CloseCaseButton({ item, open, onClose }: CloseCaseButtonProps) {
  const confirm = useConfirm()
  const { mutate } = useUpdate()

  const handleClick = () => {
    if (open) {
      void confirm({ title: "Are you sure?" }).then(() => {
        mutate(
          {
            resource: "cases",
            id: item._id,
            values: {
              endTime: new Date(),
            },
            errorNotification: {
              message: "Error updating case",
              type: "error",
            },
          },
          {
            onSuccess: () => onClose(),
          },
        )
      })
    } else {
      void confirm({ title: "Are you sure? This will discard the close date." }).then(() => {
        item.endTime = undefined
        mutate({
          resource: "cases",
          id: item._id,
          values: {
            ...item,
          },
          errorNotification: {
            message: "Error updating case",
            type: "error",
          },
          meta: {
            method: "put",
          },
        })
      })
    }
  }

  return (
    <Button variant="contained" onClick={handleClick}>
      {open ? "Close Case" : "Reopen Case"}
    </Button>
  )
}
