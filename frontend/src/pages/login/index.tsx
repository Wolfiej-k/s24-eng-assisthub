import { useAuth0 } from "@auth0/auth0-react"
import { useGo } from "@refinedev/core"
import { Loading } from "../../components/message"

export default function LoginPage() {
  const go = useGo()
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0()

  if (isLoading) {
    return <Loading />
  }

  if (isAuthenticated) {
    go({ to: "/" })
  }

  void loginWithRedirect()

  return <Loading />
}
