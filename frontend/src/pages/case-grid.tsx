import Button from "@mui/material/Button"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { useDataGrid } from "@refinedev/mui"
import { useMemo, useState } from "react"
import { type Case } from "../types"
import DetailedCaseView from "./detailed-case-view"

export default function CaseGrid() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const handleCloseDialog = () => setSelectedCase(null)

  const columns = useMemo<GridColDef<Case>[]>(
    () => [
      {
        field: "clientName",
        headerName: "Name",
        width: 180,
        valueGetter: (params) => params.row.client.name,
        renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
      },
      {
        field: "clientEmail",
        headerName: "Email",
        width: 200,
        valueGetter: (params) => params.row.client.email,
        renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
      },
      {
        field: "coachesNames",
        headerName: "Coaches",
        width: 280,
        valueGetter: (params) => params.row.coaches.map((coach) => coach.name).join(", ") ?? "",
        renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
      },
      {
        field: "startTime",
        headerName: "Start Time",
        width: 150,
        valueGetter: (params) => new Date(params.row.startTime).toLocaleDateString(),
        renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
      },
      {
        field: "endTime",
        headerName: "End Time",
        width: 150,
        valueGetter: (params) => {
          if (!params.row.endTime) {
            return ""
          }

          const date = new Date(params.row.endTime)
          return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
        },
        renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        hideable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setSelectedCase(params.row)}
            sx={{
              fontSize: "0.6rem",
            }}
          >
            View Details
          </Button>
        ),
      },
    ],
    [],
  )

  const { dataGridProps } = useDataGrid<Case>({
    resource: "cases",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sorters: {
      initial: [
        {
          field: "ID",
          order: "asc",
        },
      ],
    },
  })

  return (
    <>
      <DataGrid
        {...dataGridProps}
        getRowId={(row: Case) => row._id}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 20, 30, 50, 100]}
      />
      {selectedCase && <DetailedCaseView onClose={handleCloseDialog} item={selectedCase} />}
    </>
  )
}
