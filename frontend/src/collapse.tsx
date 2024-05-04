import { Button } from "@mui/material"
import { useThemedLayoutContext } from "@refinedev/mui"

export default function Collapse({ children }: { children: React.ReactNode }) {
  const { siderCollapsed, setSiderCollapsed, mobileSiderOpen, setMobileSiderOpen } = useThemedLayoutContext()

  return (
    <>
      <Button
        aria-label="open drawer"
        onClick={() => setSiderCollapsed(!siderCollapsed)}
        sx={{
          padding: 2,
          display: { xs: "none", md: "flex" },
          ...(!siderCollapsed && { display: "none" }),
        }}
      >
        {children}
      </Button>
      <Button
        aria-label="open drawer"
        onClick={() => setMobileSiderOpen(!mobileSiderOpen)}
        sx={{
          padding: 2,
          display: { xs: "flex", md: "none" },
          ...(mobileSiderOpen && { display: "none" }),
        }}
      >
        {children}
      </Button>
    </>
  )
}
