import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { useUpdate } from "@refinedev/core"
import { type CaseItem, type Coach } from "../types"
import { useDataGrid } from "@refinedev/mui";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import React, { useState } from "react";
import DetailedCaseView from "./detailed-case-view";
import Button from '@mui/material/Button';

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
      valueGetter: (params: GridValueGetterParams) =>
      (params.row as CaseItem).client?.name ?? '',
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
      valueGetter: (params: GridValueGetterParams) =>
      (params.row as CaseItem).client?.email ?? '',
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
      valueGetter: (params: GridValueGetterParams) =>
      (params.row as CaseItem).client?.phone ?? '',
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
      valueGetter: (params: GridValueGetterParams) =>
      (params.row as CaseItem).client?.zip ?? '',
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
      valueGetter: (params: GridValueGetterParams) =>
      (params.row as CaseItem).client?.profile ?? '' as string,
      renderCell: (params) => {
        const profileUrl = (params.value as string).startsWith('https://')? params.value as string: `https://${params.value}`;
        return (
          <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            {/* Use the adjusted profileUrl variable */}
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">{params.value}</a>
          </div>
          );
        }
    },
    {
      field: "coachesNames",
      headerName: "Coaches",
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
      (params.row as CaseItem).coaches?.map(coach => coach.name).join(', ') || 'None',
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
      valueGetter: (params: GridValueGetterParams) => new Date((params.row as CaseItem).startTime).toLocaleString(),
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
      valueGetter: (params: GridValueGetterParams) =>
      (params.row as CaseItem).data?.language ?? '',
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
      valueGetter: (params: GridValueGetterParams) =>
      (params.row as CaseItem).data?.benefits ?? '',
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
        <Button size="small" variant="contained" color="primary" onClick={() => setSelectedCase(params.row as CaseItem)}
        sx={{
          fontSize: '0.6rem',
        }}>
          View Details
        </Button>
      ),
    },
  ];

  // Dialog open & close
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  const handleCloseDialog = () => setSelectedCase(null);

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
      <DataGrid {...dataGridProps} columns={columns} autoHeight pageSizeOptions={[10, 20, 30, 50, 100]} />
      {selectedCase && (
        <DetailedCaseView onClose={handleCloseDialog} caseDetails={selectedCase}/>
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
