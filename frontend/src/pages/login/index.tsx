import { useAuth0 } from "@auth0/auth0-react"
import { useGo } from "@refinedev/core"

export default function LoginPage() {
  const go = useGo()
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    go({ to: "/" })
  }

  void loginWithRedirect()

  return <div>Loading...</div>
}
