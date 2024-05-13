import { Close, OpenInNew } from "@mui/icons-material"
import { Dialog, DialogTitle, IconButton } from "@mui/material"
import { isEqual } from "lodash"
import { useConfirm } from "material-ui-confirm"
import { useState } from "react"
import { Link } from "react-router-dom"
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
        .catch(() => undefined)
    } else {
      handleClose()
    }
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
        {/* {"Case " + item._id} */}
        {item.client.name + "'s Case"}
        <Link to={"/" + item._id}>
          <IconButton aria-label="fullpage" sx={{ position: "absolute", right: 48, top: 12 }}>
            <OpenInNew />
          </IconButton>
        </Link>
        <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 16, top: 12 }}>
          <Close />
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
