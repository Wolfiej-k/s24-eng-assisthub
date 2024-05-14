import { CloudUpload } from "@mui/icons-material"
import { Button, styled } from "@mui/material"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

interface FileUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  editable: boolean
}

export default function FileUpload({ onChange, editable }: FileUploadProps) {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUpload />}
      disabled={!editable}
    >
      Upload File
      <VisuallyHiddenInput type="file" onChange={onChange} disabled={!editable} />
    </Button>
  )
}
