import { useGo, useIsAuthenticated } from "@refinedev/core"
import { AuthPage } from "@refinedev/mui"

export default function RegisterPage() {
  const go = useGo()
  const { data } = useIsAuthenticated()

  if (data?.authenticated) {
    go({ to: "/" })
  }

  return <AuthPage type="register" />
}
