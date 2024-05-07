import CoachGrid from "./coach-grid"
import CreateCoachForm from "./create-coach"

export default function CoachesPage() {
  return (
    <div>
      <CreateCoachForm />
      <div style={{ marginTop: "50px" }}></div>
      <CoachGrid />
    </div>
  )
}
