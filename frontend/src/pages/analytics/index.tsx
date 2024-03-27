import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { FixedSizeList,  } from 'react-window';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { LineChart } from "@mui/x-charts"
import { useList } from "@refinedev/core";
import { BarChart } from "@mui/x-charts/BarChart"
import { PieChart } from "@mui/x-charts/PieChart"
import { type Case } from "../../types"
import zipCodes from './zipcodes.json'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import * as React from "react";


const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AnalyticsPage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedPlot, setSelectedPlot] = React.useState("open")
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (plot?: string) => {
    setAnchorEl(null)
    if (plot) {
      setSelectedPlot(plot)
    }
  }
  const { data: caseData, error, isLoading } = useList<Case>({ resource: "cases" })

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>;
}

  const casesArray = caseData.data;

  const monthCounts = new Array(12).fill(0)
  const monthOpenCounts = new Array(12).fill(0)
  const monthClosedCounts = new Array(12).fill(0)
  const caseLocations = new Map<string, number>()
  const casesCountPerCoach= new Map<string, number>()

  // We have to case data into Case[] because TypeScript doesn't know that data is an array of Case objects
  casesArray.forEach((caseItem) => {
    // get case amount for each month
    const startDate = new Date(caseItem.startTime);
    const startMonth = startDate.getMonth()
    monthCounts[startMonth]++

    // Get ending times for open cases otherwise no end time
    const endDate = caseItem.endTime ? new Date(caseItem.endTime) : new Date()

    const endMonth = caseItem.endTime ? endDate.getMonth() : 11
    monthClosedCounts[endMonth]++
    for (let i = startMonth; i <= endMonth; i++) {
      monthOpenCounts[i]++
    }
    // Mapping zip to county
    const location : string = caseItem.client.zip;
    if (location in zipCodes)
    {
      // idk what the fuck i did but it worked
      const currentCount = caseLocations.get(location) ?? 0;
      caseLocations.set(zipCodes[location as keyof typeof zipCodes], currentCount + 1);
    }


    // Coaches and their cases
    caseItem.coaches.forEach(coach => {
      if (caseItem.coaches.length === 0)
      {
        return;
      }
      const coachName = coach.name;
      const currentCount = casesCountPerCoach.get(coachName) ?? 0;
      casesCountPerCoach.set(coachName, currentCount + 1);
    });

  });

  // arrays after making dictionaries
  const coachChartData = Array.from(casesCountPerCoach).map(([coachName, count]) => {
    return { name: coachName, value: count };
  });
  const sortedCaseLocationsArray = Array.from(caseLocations).sort((a, b) => b[1] - a[1]);
  // fixed list needs a list we cant map like normal in list
  const Row = ({ index, data }) => {
    const [location, count] = data[index];
    return (
      <ListItem style={{display: 'flex', alignItems: 'center' }} component="div">
        <div >
          <ListItemText
          primary={`${location}: ${count}`}
          primaryTypographyProps={{ style: { fontSize: '1.25rem' } }}
          />
        </div>
      </ListItem>
    );
  };

  return (
    <div style={{ height: "100vh" }}>
      <Grid container spacing={2} sx={{ padding: '12px' }}>

        {/* Bar Graph - Top Left */}
        <Grid item xs={12} md={7}>
          <Card raised sx={{ minHeight: '200px', marginBottom: '12px' }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Number of Open Cases Each Month
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  Other Bar Graphs
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => handleClose()}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}>
                  <MenuItem onClick={() => handleClose("open")}>Open Cases by Month</MenuItem>
                  <MenuItem onClick={() => handleClose("close")}>Close Cases by Month</MenuItem>
                </Menu>
              </div>
              {selectedPlot === "open" && (<BarChart
                series={[
                  {
                    data: monthCounts,
                    color: "#13cdcd"
                  },
                ]}
                height={412}
                width={875}
                xAxis={[
                  {
                    data: monthLabels,
                    scaleType: "band",
                  },
                ]}
                margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
              />)}
              {selectedPlot === "close" && (<BarChart
                series={[
                  {
                    data: monthClosedCounts,
                    color: "#13cdcd"
                  },
                ]}
                height={412}
                width={875}
                xAxis={[
                  {
                    data: monthLabels,
                    scaleType: "band",
                  },
                ]}
                margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
              />)}
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart - Top Right */}
        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: 'none', padding: 0, alignItems: 'center' }}>
            <Typography variant="h6" align="center">
              Number of Cases per Coach
            </Typography>
            <CardContent sx={{ justifyContent: 'center' }}>
              <PieChart
                margin={{ top: 5, bottom: 10, left: 10, right: 10 }}
                height={450}
                series={[{ arcLabel: (item) => `${item.name}`, data: coachChartData }]}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card raised sx={{ minHeight: '200px', marginBottom: '12px' }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Case by Area
              </Typography>
              {/* Fixed List takes row, you can't do standard array.map */}
              <FixedSizeList
                height={448}
                width={450}
                itemSize={50}
                itemCount={sortedCaseLocationsArray.length -20}
                itemData={sortedCaseLocationsArray}>
                {Row}
              </FixedSizeList>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card raised sx={{ minHeight: '200px', marginBottom: '12px' }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Total Number of Open Cases over the Months
              </Typography>
              <LineChart
                height={448}
                xAxis={[
                  {
                    data: monthLabels,
                    scaleType: "band",
                  },
                ]}
                series={[{ data: monthOpenCounts, color: '#7f32cd' }]}
              />
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </div>
  )

}
