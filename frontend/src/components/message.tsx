import { Typography } from "@mui/material"

export function Loading() {
  return <Typography variant="h2">Loading...</Typography>
}

export function Error() {
  return <Typography variant="h2">Something went wrong!</Typography>
}

export function NotFound() {
  return <Typography variant="h2">404 Not Found</Typography>
}

export function Forbidden() {
  return <Typography variant="h2">403 Forbidden</Typography>
}
