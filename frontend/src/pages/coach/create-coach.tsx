import { Box, Button, TextField, Checkbox, FormControlLabel, Stack } from "@mui/material"
import { useState } from "react"
import { type Coach } from "../../types"


// interface CreateCoachesPageProps {
//   initialName: string;
//   initialEmail: string;
// }

const initialCoach: Coach = {
  name: '',
  email: '',
  isAdmin: false,
};

export default function CreateCoachesForm() {
  const [coach, setCoach] = useState<Coach>(initialCoach);


  const handleChange = (field: keyof Coach, value: unknown) => {
    setCoach(prevCoach => ({
      ...prevCoach,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/coaches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coach),
    })
      .then(response => response.json())
      .then(data => {
        setCoach(initialCoach); // reset the coach state after successful addition
      })
      .catch(error => {
        console.error('Error adding coach:', error);
      });
    console.log('Adding coach to database:', coach);
    setCoach(initialCoach);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          required
          name="name"
          label="Name"
          value={coach.name}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
        />
        <TextField
          required
          name="email"
          type="email"
          label="Email"
          value={coach.email}
          onChange={(e) => handleChange('email', e.target.value)}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isAdmin"
              checked={coach.isAdmin}
              onChange={(e) => handleChange('isAdmin', e.target.checked)}
            />
          }
          label="Is Admin?"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Coach
        </Button>
      </Stack>
    </Box>
  );
};
