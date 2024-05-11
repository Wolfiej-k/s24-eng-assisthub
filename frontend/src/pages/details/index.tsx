import { useOne } from "@refinedev/core"
import { useParams } from "react-router-dom"
import PageTitle from "../../page-title"
import { type Case } from "../../types"
import DetailedView from "./detailed-view"

export default function DetailsPage() {
  const { id } = useParams()

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
      <PageTitle title={data.data.client.name} />
      <DetailedView item={data.data} />
    </>
  )
}
