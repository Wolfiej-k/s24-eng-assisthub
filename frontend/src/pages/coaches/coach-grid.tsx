import { Box, Button } from "@mui/material"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { useDelete, useGetIdentity } from "@refinedev/core"
import { useDataGrid } from "@refinedev/mui"
import { useConfirm } from "material-ui-confirm"
import { useMemo } from "react"
import { type Coach } from "../../types"

export default function CoachGrid() {
  const { mutate } = useDelete()
  const { data: identity } = useGetIdentity<Coach>()
  const confirm = useConfirm()

  const handleDelete = (id: string) => {
    void confirm({ title: "Are you sure?" })
      .then(() => {
        mutate(
          { resource: "coaches", id: id, successNotification: false },
          { onSuccess: () => window.location.reload() },
        )
      })
      .catch(() => undefined)
  }
  const columns = useMemo<GridColDef<Coach>[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        headerClassName: "column-header",
        minWidth: 160,
        maxWidth: 440,
        flex: 1,
        valueGetter: (params) => params.row.name,
        renderCell: (params) => (
          <div style={{ overflow: "hidden", whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>
        ),
      },
      {
        field: "email",
        headerName: "Email",
        headerClassName: "column-header",
        minWidth: 240,
        flex: 1,
        valueGetter: (params) => params.row.email,
        renderCell: (params) => (
          <div style={{ overflow: "hidden", whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>
        ),
      },
      {
        field: "admin",
        headerName: "Admin",
        headerClassName: "column-header",
        width: 140,
        hideable: false,
        filterable: false,
        valueGetter: (params) => (params.row.admin ? "Yes" : "No"),
        renderCell: (params) => (
          <div style={{ overflow: "hidden", whiteSpace: "normal", wordWrap: "break-word" }}>{params.value}</div>
        ),
      },
      {
        field: "remove",
        headerName: "Remove",
        headerClassName: "column-header",
        width: 90,
        sortable: false,
        hideable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row._id)}
            sx={{ fontSize: "0.6rem" }}
            disabled={params.row._id == identity?._id}
          >
            Delete
          </Button>
        ),
      },
    ],
    [],
  )

  const { dataGridProps } = useDataGrid<Coach>({
    resource: "Coaches",
    pagination: {
      current: 1,
      pageSize: 10,
      mode: "client",
    },
    sorters: {
      mode: "off",
    },
    filters: {
      mode: "off",
    },
  })

  return (
    <>
      <Box
        sx={{
          height: "100%",
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
          getRowId={(row: Coach) => row._id}
          columns={columns}
          autoHeight
          pageSizeOptions={[10, 20, 30, 50, 100]}
        />
      </Box>
    </>
  )
}
