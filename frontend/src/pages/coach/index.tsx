import { Typography, useTheme } from "@mui/material"
import { useOne } from "@refinedev/core"
import { useParams } from "react-router-dom"
import { type Case } from "../../types"
import CreateCoachesForm from "./create-coach"
import DeleteCoachForm from "./delete-coach"

export default function CoachesPage() {

  return (
    <DeleteCoachForm/>
  )
}
