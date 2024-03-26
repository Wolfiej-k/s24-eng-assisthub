import Button from "@mui/material/Button"
import { DataGrid, type GridColDef, type GridValueGetterParams } from "@mui/x-data-grid"
import { useDataGrid } from "@refinedev/mui"
import { useState } from "react"
import { type CaseItem } from "../types"
// import CoachDropdown from "./coach-dropdown"
import DetailedCaseView from "./detailed-case-view"

export default function CaseGrid() {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      type: "number",
      width: 5,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      width: 90,
      valueGetter: (params: GridValueGetterParams) => (params.row as CaseItem).client?.name ?? "",
      renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
    },
    {
      field: "clientEmail",
      headerName: "Client Email",
      width: 200,
      valueGetter: (params: GridValueGetterParams) => (params.row as CaseItem).client?.email ?? "",
      renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
    },
    {
      field: "clientPhone",
      headerName: "Client Phone",
      width: 130,
      valueGetter: (params: GridValueGetterParams) => (params.row as CaseItem).client?.phone ?? "",
      renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
    },
    {
      field: "clientZip",
      headerName: "ZIP Code",
      width: 70,
      valueGetter: (params: GridValueGetterParams) => (params.row as CaseItem).client?.zip ?? "",
      renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
    },
    {
      field: "clientProfile",
      headerName: "Profile URL",
      width: 200,
      valueGetter: (params: GridValueGetterParams) => (params.row as CaseItem).client?.profile ?? ("" as string),
      renderCell: (params) => {
        const profileUrl = (params.value as string).startsWith("https://")
          ? (params.value as string)
          : `https://${params.value}`
        return (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            {/* Use the adjusted profileUrl variable */}
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              {params.value}
            </a>
          </div>
        )
      },
    },
    {
      field: "coachesNames",
      headerName: "Coaches",
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        (params.row as CaseItem).coaches?.map((coach) => coach.name).join(", ") || "None",
      renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
    },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 150,
      valueGetter: (params: GridValueGetterParams) => new Date((params.row as CaseItem).startTime).toLocaleString(),
      renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
    },
    {
      field: "language",
      headerName: "Language",
      width: 120,
      valueGetter: (params: GridValueGetterParams) => (params.row as CaseItem).data?.language ?? "",
      renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
    },
    {
      field: "benefits",
      headerName: "Benefits",
      width: 180,
      valueGetter: (params: GridValueGetterParams) => (params.row as CaseItem).data?.benefits ?? "",
      renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 180,
      valueGetter: (params: GridValueGetterParams) => (params.row as CaseItem).notes ?? "",
      renderCell: (params) => <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => setSelectedCase(params.row as CaseItem)}
          sx={{
            fontSize: "0.6rem",
          }}
        >
          View Details
        </Button>
      ),
    },
  ]

  // Dialog open & close
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)
  const handleCloseDialog = () => setSelectedCase(null)

  const { dataGridProps } = useDataGrid<CaseItem>({
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
      <DataGrid {...dataGridProps} columns={columns} autoHeight pageSizeOptions={[10, 20, 30, 50, 100]} />
      {selectedCase && (
        <DetailedCaseView onClose={handleCloseDialog} caseDetails={selectedCase} caseID={selectedCase.id} />
      )}
    </>
  )
}
