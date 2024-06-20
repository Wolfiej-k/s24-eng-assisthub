import { Button } from "@mui/material"
import { useUpdate } from "@refinedev/core"
import { useConfirm } from "material-ui-confirm"
import { type Case } from "../../types"

interface CloseCaseButtonProps {
  item: Case // The case item to be updated
  open: boolean // Boolean indicating if the case is open
  onClose: () => void // Callback function to execute on close
}

export default function CloseCaseButton({ item, open, onClose }: CloseCaseButtonProps) {
  const confirm = useConfirm() // Initialize confirm dialog
  const { mutate } = useUpdate() // Initialize mutate function for updating the case

  const handleClick = () => {
    if (open) {
      // If case is open, show confirmation dialog
      void confirm({ title: "Are you sure?" })
        // If confirmed, update the case with end time
        .then(() => {
          mutate(
            {
              resource: "cases",
              id: item._id,
              values: {
                // Save end time as current date
                endTime: new Date(),
              },
              errorNotification: {
                message: "Error updating case",
                type: "error",
              },
              successNotification: false,
            },
            {
              // Call onClose function on success
              onSuccess: onClose,
            },
          )
        }) // Handle rejection i.e. if user cancels confirmation
        .catch(() => undefined)
    } else {
      // If the case is closed, show confirmation to reopen
      void confirm({ title: "Are you sure? This will discard the close date." })
        .then(() => {
          // Remove end time from case
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
            successNotification: false,
            meta: {
              // Specify use HTTP Put method for updating
              method: "put",
            },
          })
        })
        .catch(() => undefined)
    }
  }

  // Rendering the button with appropriate label based on case state
  return (
    <Button variant="contained" onClick={handleClick}>
      {open ? "Close Case" : "Reopen Case"}
    </Button>
  )
}
