import CreateCoachForm from "./create-coach"
import CoachGrid from "./coach-grid"

export default function CoachesPage() {
  return (
    <div>
      <CreateCoachForm />
      <div style={{ marginTop: '50px' }}></div>
      <CoachGrid />
    </div>
  );
}
