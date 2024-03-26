import { useList } from "@refinedev/core"
import { type CaseItem } from "../types"
import CoachDropdown from "./coach-dropdown"

// const columns: GridColDef<CaseItem>[] = [
//   { field: "id", headerName: "ID", type: "number", width: 75 },
//   { field: "client.name", headerName: "Name", width: 150, flex: 0.5 },
//   { field: "title", headerName: "Title", width: 150, flex: 0.5 },
//   { field: "content", headerName: "Content", width: 600, flex: 1 },
//   {
//     field: "createdAt",
//     headerName: "Date created",
//     width: 150,
//     renderCell: (params) => <span>{(params.value as Date).toLocaleString()}</span>,
//   },
//   {
//     field: "status",
//     headerName: "Status",
//     width: 100,
//     align: "center",
//     type: "singleSelect",
//     valueOptions: ["draft", "rejected", "published"],
//   },
// ]

export default function CaseGrid() {
  const { data, isLoading } = useList<CaseItem>({ resource: "cases" })
  const cases = data?.data ?? []

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ color: "black" }}>
      <CoachDropdown item={cases[0]!} />
    </div>
  )

  // const { dataGridProps } = useDataGrid<IPost>({
  //   initialCurrent: 1,
  //   initialPageSize: 10,
  //   initialSorter: [
  //     {
  //       field: "ID",
  //       order: "asc",
  //     },
  //   ],
  // })

  // return <DataGrid {...dataGridProps} columns={columns} autoHeight pageSizeOptions={[10, 20, 30, 50, 100]} />
}
