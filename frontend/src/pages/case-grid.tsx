import Button from "@mui/material/Button"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { useDataGrid } from "@refinedev/mui"
import { useMemo, useState } from "react"
import { type Case } from "../types"
import DetailedViewDialog from "./details/detailed-view-dialog"

export default function CaseGrid() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const handleCloseDialog = () => setSelectedCase(null)

  const columns = useMemo<GridColDef<Case>[]>(
    () => [
      {
        field: "clientName",
        headerName: "Name",
        minWidth: 180,
        maxWidth: 260,
        flex: 1,
        valueGetter: (params) => params.row.client.name,
        renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
      },
      {
        field: "clientEmail",
        headerName: "Email",
        minWidth: 200,
        maxWidth: 300,
        flex: 1,
        valueGetter: (params) => params.row.client.email,
        renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
      },
      {
        field: "coachesNames",
        headerName: "Coaches",
        minWidth: 280,
        flex: 1,
        valueGetter: (params) => params.row.coaches?.map((coach) => coach.name).join(", ") ?? "",
        renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
      },
      {
        field: "startTime",
        headerName: "Start Time",
        minWidth: 150,
        valueGetter: (params) => new Date(params.row.startTime).toLocaleDateString(),
        renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
      },
      {
        field: "endTime",
        headerName: "End Time",
        minWidth: 150,
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
        field: "timeOpen",
        headerName: "Time Open",
        minWidth: 150,
        sortable: false,
        filterable: false,
        valueGetter: (params) => {
          const endTime = params.row.endTime
          if (endTime) {
            return "Closed"
          }
          const startTime = new Date(params.row.startTime)
          const currentTime = new Date()
          const timeDiff = currentTime.getTime() - startTime.getTime()
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))
          return `${daysDiff} days`
        },
        renderCell: (params) => {
          if (params.row.endTime) {
            return (
              <div
                style={{
                  backgroundColor: params.row.endTime ? "red" : "transparent",
                  color: params.row.endTime ? "white" : "inherit",
                  borderRadius: "20px",
                  padding: "4px 8px",
                  display: "inline-block",
                }}
              >
                {params.value}
              </div>
            )
          }

          return <div>{params.value}</div>
        },
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
            sx={{ fontSize: "0.6rem" }}
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
      {selectedCase && <DetailedViewDialog handleClose={handleCloseDialog} item={selectedCase} />}
    </>
  )
}
