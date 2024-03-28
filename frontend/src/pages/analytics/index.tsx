import { Button, Card, CardContent, Grid, ListItem, ListItemText, Menu, MenuItem, Typography } from "@mui/material"
import { BarChart, LineChart, PieChart } from "@mui/x-charts"
import { useList } from "@refinedev/core"
import { useState } from "react"
import { FixedSizeList } from "react-window"
import { type Case } from "../../types"
import zipCodes from "./zipcodes.json"

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AnalyticsPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedPlot, setSelectedPlot] = useState("open")
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

  const { data, isLoading, error } = useList<Case>({ resource: "cases" })

  if (isLoading || error) {
    return <div>Loading...</div>
  }

  const cases = data.data

  const monthCounts = new Array(12).fill(0)
  const monthOpenCounts = new Array(12).fill(0)
  const monthClosedCounts = new Array(12).fill(0)

  const caseLocations = new Map<string, number>()
  const casesCountPerCoach = new Map<string, number>()

  cases.forEach((item) => {
    const startDate = new Date(item.startTime)
    const startMonth = startDate.getMonth()
    monthCounts[startMonth]++

    const endDate = item.endTime ? new Date(item.endTime) : new Date()
    const endMonth = endDate.getMonth()

    if (item.endTime) {
      monthClosedCounts[endMonth]++
    }

    for (let i = startMonth; i <= endMonth; i++) {
      monthOpenCounts[i]++
    }

    const location = item.client.zip
    if (location in zipCodes) {
      const currentCount = caseLocations.get(location) ?? 0
      caseLocations.set(zipCodes[location as keyof typeof zipCodes], currentCount + 1)
    }

    item.coaches.forEach((coach) => {
      const currentCount = casesCountPerCoach.get(coach.name) ?? 0
      casesCountPerCoach.set(coach.name, currentCount + 1)
    })
  })

  const coachChartData = Array.from(casesCountPerCoach).map(([name, count]) => {
    return { name: name, value: count }
  })

  const sortedCaseLocationsArray = Array.from(caseLocations).sort(([, a], [, b]) => b - a)

  return (
    <Grid container spacing={2} sx={{ padding: "12px" }}>
      <Grid item xs={12} md={7}>
        <Card sx={{ minHeight: "200px", marginBottom: "12px" }}>
          <CardContent>
            <Typography variant="h6" align="center">
              {selectedPlot == "open" ? "Cases Opened per Month" : "Cases Closed per Month"}
            </Typography>
            <div style={{ display: "flex", justifyContent: "center" }}>
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
                }}
              >
                <MenuItem onClick={() => handleClose("open")}>Open Cases by Month</MenuItem>
                <MenuItem onClick={() => handleClose("close")}>Closed Cases by Month</MenuItem>
              </Menu>
            </div>
            {selectedPlot === "open" && (
              <BarChart
                series={[
                  {
                    data: monthCounts,
                    color: "#13cdcd",
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
              />
            )}
            {selectedPlot === "close" && (
              <BarChart
                series={[
                  {
                    data: monthClosedCounts,
                    color: "#13cdcd",
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
              />
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card sx={{ padding: 0, alignItems: "center" }}>
          <Typography variant="h6" align="center">
            Assigned Cases per Coach
          </Typography>
          <CardContent sx={{ justifyContent: "center" }}>
            <PieChart
              margin={{ top: 5, bottom: 10, left: 10, right: 10 }}
              height={450}
              series={[{ arcLabel: (item) => `${item.name}`, data: coachChartData }]}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ minHeight: "200px", marginBottom: "12px" }}>
          <CardContent>
            <Typography variant="h6" align="center">
              Cases by Area
            </Typography>
            <FixedSizeList height={448} width={450} itemSize={50} itemCount={sortedCaseLocationsArray.length}>
              {({ index }) => {
                const [location, count] = sortedCaseLocationsArray[index]
                return (
                  <ListItem style={{ display: "flex", alignItems: "center" }} component="div">
                    <div>
                      <ListItemText
                        primary={`${location}: ${count}`}
                        primaryTypographyProps={{ style: { fontSize: "1.25rem" } }}
                      />
                    </div>
                  </ListItem>
                )
              }}
            </FixedSizeList>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card sx={{ minHeight: "200px", marginBottom: "12px" }}>
          <CardContent>
            <Typography variant="h6" align="center">
              Total Open Cases per Month
            </Typography>
            <LineChart
              height={448}
              xAxis={[
                {
                  data: monthLabels,
                  scaleType: "band",
                },
              ]}
              series={[{ data: monthOpenCounts, color: "#7f32cd" }]}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
