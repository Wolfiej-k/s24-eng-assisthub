import React from "react";
import { Option, useSelect } from "@refinedev/core";

import { useDataGrid, List } from "@refinedev/mui";
import { DataGrid, GridColDef, GridValueFormatterParams, } from "@mui/x-data-grid";

//const API_URL = "https://api.fake-rest.refine.dev";

interface IEvent {
  id: number;
  title: string;
  date: Date;
  type: "error" | "warning" | "success";
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
      { field: "title", headerName: "Title", minWidth: 200, flex: 1 },
      {
        field: "date",
        headerName: "Date",
        minWidth: 200,
        renderCell: (params) => (
          <span>{(params.value as Date).toLocaleString()}</span>
        ),
      },
      { field: "type", headerName: "Type", minWidth: 200, type: "singleSelect",
      valueOptions: ["error", "warning", "success"], },
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
