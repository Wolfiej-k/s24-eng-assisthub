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

export default function CreateCoachesForm() {
  const [coach, setCoach] = useState<Coach>(initialCoach)

  const confirm = useConfirm()

  const { onFinish } = useForm<Coach>({
    resource: "coaches",
    action: "edit",
    id: coach._id,
    successNotification: false,
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
          name="name"
          label="Name"
          value={coach.name}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
        />
        <TextField
          required
          name="email"
          type="email"
          label="Email"
          value={coach.email}
          onChange={(e) => handleChange("email", e.target.value)}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox name="admin" checked={coach.admin} onChange={(e) => handleChange("admin", e.target.checked)} />
          }
          label="Admin?"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Coach
        </Button>
      </Stack>
    </Box>
  )
}
