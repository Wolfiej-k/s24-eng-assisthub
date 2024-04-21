import { Typography, useTheme } from "@mui/material"
import { useOne } from "@refinedev/core"
import { useParams } from "react-router-dom"
import { type Case } from "../../types"
import DetailedView from "./detailed-view"

export default function DetailsPage() {
  const { id } = useParams()
  const theme = useTheme()

  const { data, isLoading, isError } = useOne<Case>({
    resource: "cases",
    id,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Something went wrong!</div>
  }

  return (
    <>
      <Typography variant="h1" color={theme.palette.primary.dark} mb={2}>
        {data.data.client.name}
      </Typography>
      <DetailedView item={data.data} />
    </>
  )
}
