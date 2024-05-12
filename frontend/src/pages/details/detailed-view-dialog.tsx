import CloseIcon from "@mui/icons-material/Close"
import { Dialog, DialogTitle, IconButton } from "@mui/material"
import { isEqual } from "lodash"
import { useConfirm } from "material-ui-confirm"
import { useState } from "react"
import { type Case } from "../../types"
import DetailedView from "./detailed-view"

interface DetailedViewDialogProps {
  item: Case
  handleClose: () => void
}

export default function DetailedViewDialog({ item, handleClose }: DetailedViewDialogProps) {
  const [values, setValues] = useState<Case>(item)
  const [isEditing, setIsEditing] = useState(false)
  const confirm = useConfirm()

  const onClose = () => {
    if (isEditing && !isEqual(values, item)) {
      void confirm({ title: "Discard changes?" })
        .then(() => {
          handleClose()
        })
        .catch(() => {})
    } else {
      handleClose()
    }
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
        {item.client.name}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 16, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <div style={{ padding: "3%", paddingTop: "0%" }}>
        <DetailedView
          item={item}
          values={values}
          setValues={setValues}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onEditingDone={() => window.location.reload()}
        />
      </div>
    </Dialog>
  )
}
