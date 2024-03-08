import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { useDataGrid } from "@refinedev/mui"

interface IPost {
  id: number
  title: string
  content: string
  hit: number
  categoryID: number
  userID: number
  status: "draft" | "rejected" | "published"
  createdAt: Date
  publishedAt: Date
  language: number
}

const columns: GridColDef<IPost>[] = [
  { field: "id", headerName: "ID", type: "number", width: 75 },
  { field: "title", headerName: "Title", width: 150, flex: 0.5 },
  { field: "content", headerName: "Content", width: 600, flex: 1 },
  {
    field: "createdAt",
    headerName: "Date created",
    width: 150,
    renderCell: (params) => <span>{(params.value as Date).toLocaleString()}</span>,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    align: "center",
    type: "singleSelect",
    valueOptions: ["draft", "rejected", "published"],
  },
]

export default function CaseGrid() {
  const { dataGridProps } = useDataGrid<IPost>({
    initialCurrent: 1,
    initialPageSize: 10,
    initialSorter: [
      {
        field: "ID",
        order: "asc",
      },
    ],
  })

  return <DataGrid {...dataGridProps} columns={columns} autoHeight pageSizeOptions={[10, 20, 30, 50, 100]} />
}
