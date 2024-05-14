import { useOne } from "@refinedev/core"
import { AxiosError } from "axios"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Error, Loading, NotFound } from "../../components/message"
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

  const { data, isLoading, error } = useOne<Case>({
    resource: "cases",
    id,
  })

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    if (error instanceof AxiosError && error.response?.status == 404) {
      return <NotFound />
    }

    return <Error />
  }

  return (
    <>
      <PageTitle title={"Case " + data.data._id} />
      <DetailsWrapper item={data.data} />
    </>
  )
}
