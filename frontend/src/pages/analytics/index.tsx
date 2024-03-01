import { useList } from "@refinedev/core";
import * as React from 'react';
import { ScatterChart, } from '@mui/x-charts/ScatterChart';
import { LineChart } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BarChart } from '@mui/x-charts/BarChart';
import { Authenticated } from "@refinedev/core";

interface ScatterValueType {
  id: number ;
  name: string;
  material: string;
  price: number;
}

export default function AnalyticsPage() {
  const { data, isLoading, error } = useList<ScatterValueType>({ resource: "products" });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedPlot, setSelectedPlot] = React.useState<string | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (plot?: string) => {
    setAnchorEl(null);
    if (plot) {
      setSelectedPlot(plot);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const product = data?.data;

  return (
    // from mui
    <Authenticated key="dashboard">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop : "20px" }}>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Choose Plot
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => handleClose('scatter')}>Scatter Chart</MenuItem>
          <MenuItem onClick={() => handleClose('line')}>Line Chart</MenuItem>
          <MenuItem onClick={() => handleClose('pie')}>Pie Chart</MenuItem>
          <MenuItem onClick={() => handleClose('bar')}>Bar Chart</MenuItem>
        </Menu>

        {selectedPlot === 'scatter' && (
          <ScatterChart
            width={600}
            height={300}
            series={[{ label: 'Products', data: product.map(v => ({ x: v.id, y: v.price })) }]}
          />
        )}

        {selectedPlot === 'line' && (
          <LineChart
            width={600}
            height={300}
            area={true}
            series={[{ label: 'Products', data: product.map(v => ({ x: v.id, y: v.price })) }]}
          />
        )}

        {selectedPlot === 'pie' && (
          <PieChart
            // colors={['red', 'blue', 'green']}
            width={600}
            height={600}
            series={[{data: product.map(v => ({ id: v.id, value: v.price, })), arcLabel: (product) => `${product.id} (${product.value})`, }]}
          />
        )}

        {selectedPlot === 'bar' && (
        <BarChart
        series={[
          {
            data: product.map(p => p.price)
          }
        ]}
        height={290}
        xAxis={[
          {
            data: product.map(p => p.name),
            scaleType: 'band'
          }
        ]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      />)}
    </div>
    </Authenticated>
  );
}
