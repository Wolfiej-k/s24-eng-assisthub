import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { List, useDataGrid } from "@refinedev/mui"
import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import DetailedCaseView from "./detailed-case-view";

interface IEvent {
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
export default function EventGrid() {

  const { dataGridProps } = useDataGrid<IEvent>({
    initialCurrent: 1,
    initialPageSize: 10,
    initialSorter: [
      {
        field: "ID",
        order: "asc",
      },
    ],
    syncWithLocation: true,
  });

  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (eventId: number) => {
    const event = dataGridProps.rows.find((row) => row.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
    setOpenDialog(false);
  };

  const columns: GridColDef<IEvent>[] = [
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
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      // demo button w/o function
      renderCell: (params) => (
        <Button className="ml-1 mr-1 flex-auto" onClick={() => handleOpenDialog(params.row.id)}>View Details</Button>
      ),
    },
  ]

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight pageSizeOptions={[10, 20, 30, 50, 100]} />
      <DetailedCaseView event={selectedEvent} onClose={handleCloseDialog} />
    </List>
  )
}
