import CoachGrid from "./coach-grid"
import CreateCoachForm from "./create-coach"
import PageTitle from "../../components/page-title"
import { Typography } from "@mui/material"

export default function CoachesPage() {
  return (
    <>
      <PageTitle title={"Create/Remove Coaches"} />
      <div style={{ marginTop: "25px" }}></div>
      <Typography variant="h2">Add Coach</Typography>
      <CreateCoachForm />
      <div style={{ marginTop: "50px" }}></div>
      <Typography variant="h2">Current Coaches</Typography>
      <CoachGrid />
    </>
  )
}
