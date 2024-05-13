import { useOne } from "@refinedev/core"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Error, Loading } from "../../components/message"
import PageTitle from "../../components/page-title"
import { type Case } from "../../types"
import DetailedView from "./detailed-view"

function DetailsWrapper({ item }: { item: Case }) {
  const [values, setValues] = useState<Case>(item)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <DetailedView
      item={item}
      values={values}
      setValues={setValues}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onEditingDone={() => window.location.reload()}
    />
  )
}

export default function DetailsPage() {
  const { id } = useParams()

  const { data, isLoading, isError } = useOne<Case>({
    resource: "cases",
    id,
  })

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return (
    <>
      <PageTitle title={data.data.client.name + "'s Case"} />
      <DetailsWrapper item={data.data} />
    </>
  )
}
