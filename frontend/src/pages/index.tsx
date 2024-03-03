import { Authenticated } from "@refinedev/core"

import EventGrid from "./dashboard"

export default function HomePage() {
  return (
    <>
      <Authenticated key="dashboard">
        <EventGrid />
      </Authenticated>
    </>
  )
}
