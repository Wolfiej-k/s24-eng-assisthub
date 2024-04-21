import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import React, { useEffect, useState } from "react"
import { type Coach } from "../../types"

const DeleteCoachForm: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)

  useEffect(() => {
    fetch("http://localhost:3000/api/coaches/")
      .then((response) => response.json())
      .then((data) => setCoaches(data))
      .catch(Error)
  }, [])

  const handleDeleteCoach = (coachToDelete: Coach) => {
    if (selectedCoach) {
      fetch(`http://localhost:3000/api/coaches${selectedCoach._id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          setCoaches((prevCoaches) => prevCoaches.filter((coach) => coach._id !== coachToDelete._id))
          setSelectedCoach(null)
        })
        .catch(Error)
    }
  }

  return (
    <Box>
      <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
        <InputLabel id="coach-select-label">Select Coach</InputLabel>
        <Select
          labelId="coach-select-label"
          id="coach-select"
          value={selectedCoach ?? ""}
          onChange={(e) => {
            setSelectedCoach(e.target.value as Coach | null)
            const selectedId = e.target.value
            const selectedCoach = coaches.find((coach) => coach._id === selectedId)
            handleDeleteCoach(selectedCoach)
          }}
          label="Select Coach"
        >
          {coaches.map((coach) => (
            <MenuItem key={coach._id} value={coach._id}>
              {coach.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDeleteCoach}
        disabled={!selectedCoach}
        sx={{ mt: 2 }}
      >
        Delete Coach
      </Button>
    </Box>
  )
}

export default DeleteCoachForm
