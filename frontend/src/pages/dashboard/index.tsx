import React from "react";
import { useState, useEffect } from "react";
import { useDataGrid, List } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface IEvent {
  id: number;
  title: string;
  date: Date;
  type: "error" | "warning" | "success";
}

export const DashboardPage: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const { dataGridProps } = useDataGrid<IEvent>();
  const {
    paginationMode,
    paginationModel,
    onPaginationModelChange,
    ...restDataGridProps
  } = dataGridProps;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        const data = await response.json() as IEvent[];

        const eventsWithParsedDate = data.map((event: IEvent) => ({
          ...event,
          date: new Date(event.date),
        }));

        setEvents(eventsWithParsedDate);
        } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    void fetchData();
  }, []);

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
      { field: "type", headerName: "Type", minWidth: 200 },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} {...restDataGridProps} rows={events} paginationMode={paginationMode}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange} autoHeight />
    </List>
  );
};

  export default DashboardPage;
