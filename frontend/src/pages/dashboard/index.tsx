import React from "react";
import { Option, useSelect } from "@refinedev/core";

import { useDataGrid, List } from "@refinedev/mui";
import { DataGrid, GridColDef, GridValueFormatterParams, } from "@mui/x-data-grid";

//const API_URL = "https://api.fake-rest.refine.dev";

interface IEvent {
  id: number;
  title: string;
  content: string;
  hit: number;
  categoryID: number;
  userID: number;
  status: "draft" | "rejected" | "published";
  createdAt: Date;
  publishedAt: Date;
  language: number;
}

export const EventList: React.FC = () => {
  /*const { data: events } = useList<IEvent[]>({
    resource: "events",
    dataProviderName: "default",
  });*/

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

  const {
    options,
    queryResult: { isLoading },
  } = useSelect<IEvent>({
    resource: "events",
  });

  const columns = React.useMemo<GridColDef<IEvent>[]>(
    () => [
      { field: "id", headerName: "ID", type: "number", width: 75 },
      { field: "title", headerName: "Title", width: 75, flex: 0.5 },
      { field: "content", headerName: "Content", minWidth: 200, flex: 1 },
      {
        field: "createdAt",
        headerName: "Date created",
        width: 150,
        renderCell: (params) => (
          <span>{(params.value as Date).toLocaleString()}</span>
        ),
      },
      {
        field: "publishedAt",
        headerName: "Date published",
        width: 150,
        renderCell: (params) => (
          <span>{(params.value as Date).toLocaleString()}</span>
        ),
      },
      { field: "status", headerName: "Status", width: 100, align: "center", type: "singleSelect",
      valueOptions: ["draft", "rejected", "published"],
      },
    ],
    [options, isLoading]
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight
        pageSizeOptions={[10, 20, 30, 50, 100]} />
    </List>
  );
};

export default EventList;
