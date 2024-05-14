import { Box, Button, Checkbox, FormControlLabel, Stack, TextField } from "@mui/material"
import { useForm } from "@refinedev/core"
import { useConfirm } from "material-ui-confirm"
import { useState } from "react"
import { type Coach } from "../../types"

const initialCoach = {
  name: "",
  email: "",
  admin: false,
}

interface CreateCoachFormProps {
  onClose: () => void
}

export default function CreateCoachForm({ onClose }: CreateCoachFormProps) {
  const [coach, setCoach] = useState(initialCoach)
  const confirm = useConfirm()

  const { onFinish } = useForm<Coach>({
    resource: "coaches",
    action: "create",
    successNotification: false,
    onMutationSuccess: onClose,
  })

  const handleChange = (field: keyof Coach, value: unknown) => {
    setCoach({ ...coach, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void confirm({ title: "Create new coach?" }).then(() => {
      setCoach(initialCoach)
      void onFinish(coach)
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          required
          margin="dense"
          name="name"
          label="Name"
          value={coach.name}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
        />
        <TextField
          required
          margin="dense"
          name="email"
          type="email"
          label="Email"
          value={coach.email}
          onChange={(e) => handleChange("email", e.target.value)}
          fullWidth
        />
        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
          {" "}
          <Button type="submit" variant="contained" color="primary">
            Add Coach
          </Button>
          <FormControlLabel
            control={
              <Checkbox name="admin" checked={coach.admin} onChange={(e) => handleChange("admin", e.target.checked)} />
            }
            label="Admin?"
            sx={{ color: "primary.dark" }}
          />
        </Stack>
      </Stack>
    </Box>
  )
}
