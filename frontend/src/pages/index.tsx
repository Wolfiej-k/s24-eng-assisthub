import { Authenticated } from "@refinedev/core"

export default function HomePage() {
  return (
    <>
      <Authenticated key="dashboard">
        Welcome to AssistHub!
      </Authenticated>
    </>
  )
}
