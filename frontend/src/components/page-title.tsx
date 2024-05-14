import { Box, Divider, Grid, Typography } from "@mui/material"
import { useGetIdentity } from "@refinedev/core"
import { type Coach } from "../types"

interface PageTitleProps {
  title: string
  decorator?: JSX.Element
}

export default function PageTitle({ title, decorator }: PageTitleProps) {
  const { data: identity } = useGetIdentity<Coach>()

  return (
    <>
      <Grid container sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography variant="h1" sx={{ color: "primary.dark", display: "inline" }}>
            {title}
            {decorator}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="h2" sx={{ color: "primary.dark", display: "inline" }}>
                {identity?.name}
              </Typography>
            </Grid>
            <Grid item>
              <Divider orientation="vertical" sx={{ display: "inline" }} />
            </Grid>
            <Grid item>
              <Typography variant="h2" sx={{ color: "primary.dark", display: "inline" }}>
                {identity ? (identity?.admin ? "Admin" : "Coach") : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ height: 8 }} />
    </>
  )
}
