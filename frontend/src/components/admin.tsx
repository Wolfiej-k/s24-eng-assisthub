import { useGetIdentity } from "@refinedev/core"
import { type Coach } from "../types"
import { Forbidden, Loading } from "./message"

export default function Admin({ children }: { children: JSX.Element }) {
  const { data: identity } = useGetIdentity<Coach>()

  if (!identity) {
    return <Loading />
  }

  if (!identity.admin) {
    return <Forbidden />
  }

  return children
}
