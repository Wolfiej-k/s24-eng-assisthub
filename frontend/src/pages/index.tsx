import { Authenticated } from "@refinedev/core"

import EventGrid from "./event-grid"

export default function HomePage() {
  return (
    <>
      <Authenticated key="dashboard">
        <EventGrid />
      </Authenticated>
    </>
  )
}
