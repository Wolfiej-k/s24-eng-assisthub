import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid"
import { useDataGrid } from "@refinedev/mui"
import { useMemo, useState } from "react"
import { type Coach } from "../../types"
import { DeleteButton } from "@refinedev/antd";

export default function CoachGrid() {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const handleCloseDialog = () => setSelectedCoach(null)

  const DeleteCoachButton = ({ _id }: { _id: string }) => (
    <DeleteButton resource="coaches" recordItemId={_id} />
  );

  const columns = useMemo<GridColDef<Coach>[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        minWidth: 180,
        maxWidth: 260,
        flex: 1,
        valueGetter: (params) => params.row.name,
        renderCell: (params) => (
          <div style={{ overflow: "hidden", whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>
        ),
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 120,
        maxWidth: 300,
        flex: 1,
        valueGetter: (params) => params.row.email,
        renderCell: (params) => (
          <div style={{ overflow: "hidden", whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>
        ),
      },
      {
        field: "admin",
        headerName: "Admin",
        minWidth: 120,
        maxWidth: 300,
        flex: 1,
        valueGetter: (params) => params.row.admin ? "YES" : "NO",
        renderCell: (params) => (
          <div style={{ overflow: "hidden", whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>
        ),
      },
      {
        field: "remove",
        headerName: "Remove",
        minWidth: 200,
        maxWidth: 300,
        sortable: false,
        hideable: false,
        filterable: false,
        renderCell: (params) => (
          <DeleteCoachButton _id={params.row._id} />
        ),
      }
    ],
    [],
  )

  const { dataGridProps } = useDataGrid<Coach>({
    resource: "Coaches",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      mode: "off",
    },
  })

  return (
    <>
      <DataGrid
        {...dataGridProps}
        getRowId={(row: Coach) => row._id}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 20, 30, 50, 100]}
      />
    </>
  )
}
