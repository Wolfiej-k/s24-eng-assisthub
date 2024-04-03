import { Button } from "@mui/material"
import { useUpdate } from "@refinedev/core"
import { useConfirm } from "material-ui-confirm"

interface CloseCaseButtonProps {
  caseId: string
  open: boolean
}

export default function CloseCaseButton({ caseId, open }: CloseCaseButtonProps) {
  const confirm = useConfirm()
  const { mutate } = useUpdate()

  const handleClick = () => {
    const confirmMessage = open
      ? "Are you sure you want to close this case? This will set the end time to the current date and time."
      : "Are you sure you want to reopen this case? This will discard the close date."

    void confirm({ title: confirmMessage }).then(() => {
      mutate({
        resource: "cases",
        id: caseId,
        values: {
          endTime: open ? new Date() : null,
          open: !open,
        },
        successNotification: {
          message: open ? "Case closed successfully" : "Case reopened successfully",
          type: "success",
        },
        errorNotification: {
          message: "Error updating case",
          type: "error",
        },
      })
    })
  }

  return (
    <Button variant="contained" onClick={handleClick}>
      {open ? "Close Case" : "Reopen Case"}
    </Button>
  )
}
