import { Box, Divider, Grid, Typography, useTheme } from "@mui/material"
import { useGetIdentity } from "@refinedev/core"

export default function PageTitle({ title }: { title: string }) {
  const { data: identity } = useGetIdentity<{ email: string }>()
  const theme = useTheme()

  return (
    <>
      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid item>
          <Typography variant="h1" sx={{ color: theme.palette.primary.dark, display: "inline" }}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Divider orientation="vertical" sx={{ display: "inline" }} />
        </Grid>
        <Grid item>
          <Typography variant="h2" sx={{ color: theme.palette.primary.dark, display: "inline" }}>
            {identity?.email}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ height: 20 }} />
    </>
  )
}

// borderColor: theme.palette.primary.main
