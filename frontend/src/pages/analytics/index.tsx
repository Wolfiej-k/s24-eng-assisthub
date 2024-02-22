import { useList } from "@refinedev/core";
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

interface Product {
  id: number;
  name: string;
  material: string;
  price: number;
}

export default function AnalyticsPage() {
  // Product used for
  const { data, isLoading, error } = useList<Product>({
    resource: "products",
  });


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const product = data?.data;

 // So like each field is by defined by id which is displayed on the table with ID, each column is specific to the product table
 // So id, name, description are fields in the products record
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'price', headerName: 'Price', type: 'number', width: 110 },
    { field: 'material', headerName: 'Material', width: 180 },
  ];
  // So the rows are the data that is displayed in the table
  // simple list.map function to map the data to the table
  const rows = product?.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    material: product.material,
  })) || [];


  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
);
}

