import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { useUpdate } from "@refinedev/core"
import { type CaseItem, type Coach } from "../types"
import { useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import DetailedCaseView from "./detailed-case-view";

export default function CoachDropdown({ item }: { item: CaseItem }) {
  const { mutate } = useUpdate()

  const updateCase = (coaches: Coach[]) => {
    mutate({
      resource: "cases",
      values: {
        ...item,
        coaches: coaches,
      },
      id: item.id,
      meta: {
        method: "put",
      },
      successNotification: false,
    })
  }

  // Populating columns for table
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
      valueGetter: params => params.row.client?.name ?? '',
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      )
    },
    {
      field: "clientEmail",
      headerName: "Client Email",
      width: 200,
      valueGetter: params => params.row.client?.email ?? '',
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      )
    },
    {
      field: "clientPhone",
      headerName: "Client Phone",
      width: 130,
      valueGetter: params => params.row.client?.phone ?? '',
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      )
    },
    {
      field: "clientZip",
      headerName: "ZIP Code",
      width: 70,
      valueGetter: params => params.row.client?.zip ?? '',
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      )
    },
    {
      field: "clientProfile",
      headerName: "Profile URL",
      width: 200,
      valueGetter: params => params.row.client?.profile ?? '',
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          <a href={params.value} target="_blank" rel="noopener noreferrer">{params.value}</a>
        </div>
      )
    },
    {
      field: "coachesNames",
      headerName: "Coaches",
      width: 200,
      valueGetter: params => params.row.coaches?.map(coach => coach.name).join(', ') || 'None',
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      )
    },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 150,
      valueGetter: params => new Date(params.row.startTime).toLocaleString(),
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      )
    },
    {
      field: "language",
      headerName: "Language",
      width: 120,
      valueGetter: params => params.row.data?.language ?? '',
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      )
    },
    {
      field: "benefits",
      headerName: "Benefits",
      width: 180,
      valueGetter: params => params.row.data?.benefits ?? '',
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <button onClick={() => handleOpenDialog(params.row.id)}>View Details</button>
      ),
    },
  ];

  // Dialog open & close
  const [selectedEventID, setSelectedEventID] = useState<number | null>(null);
  const handleOpenDialog = (eventId: number) => {
    setSelectedEventID(eventId);
  };

  const handleCloseDialog = () => {
    setSelectedEventID(null);
  };

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
    <div>
      <Autocomplete
        multiple
        id="coach-dropdown"
        options={coachList}
        getOptionLabel={(option) => option.name}
        defaultValue={item.coaches}
        onChange={(_, value) => updateCase(value)}
        renderInput={(params) => <TextField {...params} variant="standard" label="Select Coaches" />}
      />
      <DataGrid {...dataGridProps} columns={columns} autoHeight pageSizeOptions={[10, 20, 30, 50, 100]} getRowId={(row) => row.id}/>
      {selectedEventID && (
        <DetailedCaseView eventID={selectedEventID} onClose={handleCloseDialog} />
      )}
    </div>
  );
}

const coachList: Coach[] = [
  { name: "Coach Name1", email: "coach@123coach.com" },
  { name: "Coach Name2", email: "coach@123coach.com" },
  { name: "Coach Name3", email: "coach@123coach.com" },
  { name: "Coach Name4", email: "coach@123coach.com" },
  { name: "Coach Name5", email: "coach@123coach.com" },
  { name: "Coach Name6", email: "coach@123coach.com" },
  { name: "Coach Name7", email: "coach@123coach.com" },
  { name: "Coach Name8", email: "coach@123coach.com" },
  { name: "Coach Name9", email: "coach@123coach.com" },
]
