import { AddCircle, Close } from "@mui/icons-material"
import { Dialog, DialogTitle, IconButton } from "@mui/material"
import { useState } from "react"
import PageTitle from "../../components/page-title"
import CoachGrid from "./coach-grid"
import CreateCoachForm from "./create-coach"

export default function CoachesPage() {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    window.location.reload()
  }

  return (
    <>
      <PageTitle
        title="Coaches"
        decorator={
          <IconButton aria-label="addcoach" color="primary" onClick={handleClickOpen}>
            <AddCircle />
          </IconButton>
        }
      />
      <CoachGrid />
      {open && (
        <Dialog open={true} onClose={handleClose} fullWidth>
          <DialogTitle>
            {"Add Coach"}
            <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 16, top: 12 }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <div style={{ padding: "3%", paddingTop: "0%" }}>
            <CreateCoachForm onClose={handleClose} />
          </div>
        </Dialog>
      )}
    </>
  )
}
