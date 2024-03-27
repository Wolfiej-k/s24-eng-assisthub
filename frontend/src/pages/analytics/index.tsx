import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { LineChart } from "@mui/x-charts"
import { useList } from "@refinedev/core";
import { BarChart } from "@mui/x-charts/BarChart"
import { PieChart } from "@mui/x-charts/PieChart"
import { type Case } from "../../types"
import zipCodes from './zipcodes.json'
import * as React from "react";


/*
export interface Client {
  name: string
  email: string
  phone: string
  zip: string
  profile: string
}

export interface Coach {
  _id?: string
  name: string
  email: string
}

export interface Case {
  _id: string
  client: Client
  coaches: Coach[]
  data: Record<string, string>
  startTime: Date
  endTime?: Date
  notes?: string
}
OBJECTID,Zip Code,Post Office Name
*/
type zipMap = {
  [zip in string]: string;
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AnalyticsPage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedPlot, setSelectedPlot] = React.useState("line")
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
  const caseLocations = new Map<string, number>()
if (Array.isArray(casesArray)) {
  // We have to case data into Case[] because TypeScript doesn't know that data is an array of Case objects
  casesArray.forEach((caseItem) => {
    // get case amount for each month
    const startDate = new Date(caseItem.startTime);
    const startMonth = startDate.getMonth()
    monthCounts[startMonth]++

    // Get ending times for open cases otherwise no end time
    const endDate = caseItem.endTime ? new Date(caseItem.endTime) : new Date()
    const endMonth = caseItem.endTime ? endDate.getMonth() : 11
    for (let i = startMonth; i <= endMonth; i++) {
      monthOpenCounts[i]++
    }
    const location : string= caseItem.client.zip;
    if (location in zipCodes)
    {
      // idk what the fuck i did but it worked
      caseLocations.set(zipCodes[location as keyof typeof zipCodes], (caseLocations.get(location) ?? 0) + 1)
      console.log(caseLocations)
    }
  });
}


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10px",
        justifyContent: "center",
      }}
    >
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
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
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleClose("line")}>Open Cases by Month</MenuItem>
        <MenuItem onClick={() => handleClose("start")}>Start Time of Cases by Month</MenuItem>
        <MenuItem onClick={() => handleClose("area")}>Cases by Location</MenuItem>
      </Menu>
      {selectedPlot === "line" && (
        <LineChart
          width={700}
          height={400}
          xAxis={[
            {
              data: monthLabels,
              scaleType: "band",
            },
          ]}
          series={[{ data: monthOpenCounts }]}
        />
      )}
      {selectedPlot === "start" && (
        <BarChart
          series={[
            {
              data: monthCounts,
            },
          ]}
          height={290}
          width={1000}
          xAxis={[
            {
              data: monthLabels,
              scaleType: "band",
            },
          ]}
          margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
      )}
      {selectedPlot === "area" && (
        <PieChart
          series={[
            {
              data: Array.from(caseLocations).map(([location, count]) => ({
                name: location,
                value: count,
              })),
            },
          ]}
          height={700}
          width={700}
        />
      )
      }
    </div>
  )
}
