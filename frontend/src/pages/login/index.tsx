import { useGo, useIsAuthenticated } from "@refinedev/core"
import { AuthPage } from "@refinedev/mui"

export default function LoginPage() {
  const go = useGo()
  const { data } = useIsAuthenticated()

  if (data?.authenticated) {
    go({ to: "/dashboard" })
  }

  return <AuthPage type="login" />
}
