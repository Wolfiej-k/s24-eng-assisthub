import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid"
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
        field: "client.name",
        headerName: "Name",
        headerClassName: "column-header",
        minWidth: 150,
        maxWidth: 260,
        flex: 1,
        valueGetter: (params) => params.row.client.name,
        renderCell: (params) => (
          <div style={{ overflow: "hidden", whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>
        ),
      },
      {
        field: "client.email",
        headerName: "Email",
        headerClassName: "column-header",
        minWidth: 180,
        maxWidth: 350,
        flex: 1,
        valueGetter: (params) => params.row.client.email,
        renderCell: (params) => <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{params.value}</div>,
      },
      {
        field: "coaches.name",
        headerName: "Coaches",
        headerClassName: "column-header",
        minWidth: 280,
        flex: 1,
        valueGetter: (params) => params.row.coaches.map((coach) => coach.name).join(", ") ?? "",
        renderCell: (params) => (
          <div style={{ overflow: "hidden", whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>
        ),
      },
      {
        field: "startTime",
        headerName: "Start Date",
        headerClassName: "column-header",
        minWidth: 160,
        type: "dateTime",
        valueGetter: (params) => new Date(params.row.startTime),
        renderCell: (params: GridRenderCellParams<object, Date>) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value?.toLocaleDateString()}</div>
        ),
      },
      {
        field: "endTime",
        headerName: "End Date",
        headerClassName: "column-header",
        minWidth: 160,
        type: "dateTime",
        valueGetter: (params) => params.row.endTime && new Date(params.row.endTime),
        renderCell: (params: GridRenderCellParams<object, Date>) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value?.toLocaleDateString()}</div>
        ),
      },
      {
        field: "daysOpen",
        headerName: "Days Open",
        headerClassName: "column-header",
        minWidth: 160,
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
        headerClassName: "column-header",
        minWidth: 110,
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
    filters: {
      mode: "off",
    },
  })

  return (
    <>
      <Box
        sx={{
          height: 300,
          width: "100%",
          "& .column-header": {
            backgroundColor: "rgb(255, 255, 255)",
            typography: "subtitle1",
            fontWeight: "bold",
          },
          ".MuiDataGrid-columnSeparator": {
            display: "none",
          },
        }}
      >
        <DataGrid
          {...dataGridProps}
          getRowId={(row: Case) => row._id}
          columns={columns}
          autoHeight
          pageSizeOptions={[10, 20, 30, 50, 100]}
        />
      </Box>
      {selectedCase && <DetailedViewDialog handleClose={handleCloseDialog} item={selectedCase} />}
    </>
  )
}
