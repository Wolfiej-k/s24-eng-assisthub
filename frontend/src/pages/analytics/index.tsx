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

interface Client {
  name: string;
  email: string;
  phone: string;
  zip: string;
};

interface Case {
  client: Client;
  language: string | undefined;
  benefits: string | undefined;
};

interface CaseItem extends Case {
  id: number;
  startTime: Date;
  endTime?: Date;
};

const languages = ["English", "Spanish", "Chinese", "Korean"];

const benefits = ["Health Insurance", "Legal Aid", "Housing Assistance", "food vouchers"];

const clients: Client[] = Array.from({ length: 10 }, (_, i) => ({
  name: `Client ${i + 1}`,
  email: `client${i + 1}@example.com`,
  phone: `123-456-78${i}0`,
  zip: `1234${i}`
}));

// Generating sample Cases, associating each with a client
const cases: Case[] = clients.map((client, i) => ({
  client,
  language: languages[i % languages.length],
  benefits: benefits[i % benefits.length]
}));

// Generating sample CaseItems, each associated with a case
const caseItems: CaseItem[] = cases.map((c, i) => ({
  ...c,
  id: i + 1,
  startTime: new Date(2023, 0, i + 1),
  endTime: i % 4 === 0 ? new Date(2023, 0, i + 2) : undefined
}));


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

  // memoize the number of each language class
  // I used useMemo to store the number of cases for each language
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  const caseByLanguage = React.useMemo(() => {
    return cases.reduce((accumulator, currentCase) => {

      const caseLanguage = currentCase.language;
      // if language doesn't exist put it in the array
      if (!accumulator[caseLanguage]) {
        accumulator[caseLanguage] = 0;
      }
      accumulator[caseLanguage]++;
      return accumulator;
    }, {} as Record<string, number>);
  }, []);


  const caseByBenefits = React.useMemo(() => {
    return cases.reduce((accumulator, currentCase) => {

      const caseByBenefits = currentCase.benefits;
      // if language doesn't exist put it in the array
      if (!accumulator[caseByBenefits]) {
        accumulator[caseByBenefits] = 0;
      }
      accumulator[caseByBenefits]++;
      return accumulator;
    }, {} as Record<string, number>);
  }, []);

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop : "10px" }}>
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
          <MenuItem onClick={() => handleClose('language')}>Case by Language</MenuItem>
          <MenuItem onClick={() => handleClose('benefits')}>Case by Benefit</MenuItem>
          <MenuItem onClick={() => handleClose('bar')}>Bar Chart</MenuItem>

        </Menu>

        {selectedPlot === 'scatter' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ScatterChart
            width={700}
            height={400}
            series={[{ label: 'Products', data: product.map(v => ({ x: v.id, y: v.price })) }]}
          />
          </div>
        )}

        {selectedPlot === 'line' && (
          <LineChart
            width={700}
            height={400}
            series={[{ label: 'Products', data: product.map(v => ({ x: v.id, y: v.price })) }]}
          />
        )}

        {selectedPlot === 'language' && (
          <PieChart
            // colors={['red', 'blue', 'green']}

            width={600}
            height={600}
            series={[{
              // I want to display the number of cases for each language
              data: Object.entries(caseByLanguage).map(([language, count]) => ({
                id: language,
                value: count,
              })),
              arcLabel: ({ id, value }) => `${id} (${value})`,
            }]}/>
        )}
        {selectedPlot === 'benefits' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <PieChart
            // colors={['red', 'blue', 'green']}

            width={600}
            height={600}
            series={[{
              // I want to display the number of cases for each language
              data: Object.entries(caseByBenefits).map(([benefit, count]) => ({
                id: benefit,
                value: count,
              })),
              arcLabel: ({ id, value }) => `${id} (${value})`,
            }]}/>
          </div>
        )}
        {selectedPlot === 'bar' && (
        <BarChart
        series={[
          {
            data: product.map(p => p.price)
          }
        ]}
        height={290}
        width={1000}
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
