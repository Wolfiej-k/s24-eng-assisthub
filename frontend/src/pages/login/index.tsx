import { useAuth0 } from "@auth0/auth0-react"
import { useGo, useIsAuthenticated } from "@refinedev/core"

export default function LoginPage() {
  const go = useGo()
  const { data } = useIsAuthenticated()
  const { loginWithRedirect } = useAuth0()

  if (data?.authenticated) {
    go({ to: "/" })
  }

  return <button onClick={() => void loginWithRedirect()}>Log In</button>
}
