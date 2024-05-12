import { Box, Divider, Grid, Typography, useTheme } from "@mui/material"
import { useGetIdentity } from "@refinedev/core"
import { type Coach } from "../types"

export default function PageTitle({ title }: { title: string }) {
  const { data: identity } = useGetIdentity<Coach>()
  const theme = useTheme()

  return (
    <>
      <Grid container sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography variant="h1" sx={{ color: theme.palette.primary.dark, display: "inline" }}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="h2" sx={{ color: theme.palette.primary.dark, display: "inline" }}>
                {identity?.name}
              </Typography>
            </Grid>
            <Grid item>
              <Divider orientation="vertical" sx={{ display: "inline" }} />
            </Grid>
            <Grid item>
              <Typography variant="h2" sx={{ color: theme.palette.primary.dark, display: "inline" }}>
                {identity?.admin ? "Admin" : "Coach"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ height: 20 }} />
    </>
  )
}
