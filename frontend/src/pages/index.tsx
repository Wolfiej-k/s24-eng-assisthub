import { Authenticated } from "@refinedev/core"

import CaseGrid from "./case-grid"

export default function HomePage() {
  return (
    <>
      <Authenticated key="dashboard">
        <CaseGrid />
      </Authenticated>
    </>
  )
}
