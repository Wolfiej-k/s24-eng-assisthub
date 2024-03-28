import Button from "@mui/material/Button"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { useDataGrid } from "@refinedev/mui"
import { useState } from "react"
import { type Case } from "../types"
import DetailedCaseView from "./detailed-case-view"

export default function CaseGrid() {
  const columns: GridColDef<Case>[] = [
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
      valueGetter: (params) => params.row.coaches.map((coach) => coach.name).join(", ") ?? "",
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
      field: "actions",
      headerName: "Actions",
      sortable: false,
      hideable: false,
      filterable: false,
      width: 110,
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
  ]

  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const handleCloseDialog = () => setSelectedCase(null)

  const { dataGridProps } = useDataGrid<Case>({
    resource: "cases",
    initialCurrent: 1,
    initialPageSize: 10,
    initialSorter: [
      {
        field: "ID",
        order: "asc",
      },
    ],
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
