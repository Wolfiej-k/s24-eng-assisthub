import { Card, CardContent, Grid, Typography, useTheme } from "@mui/material"
import { BarChart, LineChart, pieArcLabelClasses, PieChart } from "@mui/x-charts"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useList } from "@refinedev/core"
import { type Dayjs } from "dayjs"
import { useState } from "react"
import { Error, Loading } from "../../components/message"
import { type Case } from "../../types"
import ChartContainer from "./chart-container"
import zipCodes from "./zipcodes.json"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AnalyticsCharts() {
  const [start, setStart] = useState<Dayjs | null>(null)
  const [end, setEnd] = useState<Dayjs | null>(null)
  const theme = useTheme()

  const { data, isLoading, isError } = useList<Case>({
    resource: "cases",
    pagination: {
      mode: "off",
    },
    sorters: [
      {
        field: "startTime",
        order: "asc",
      },
    ],
  })

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  const allCases = data.data.map((item) => ({
    ...item,
    startTime: new Date(item.startTime),
    endTime: item.endTime ? new Date(item.endTime) : null,
  }))

  const startIndex = allCases.findIndex((item) => !start || item.startTime >= start.toDate())
  const endIndex = allCases.findIndex((item) => end && item.startTime > end.toDate())

  const cases = allCases.slice(
    startIndex >= 0 ? startIndex : allCases.length,
    endIndex >= 0 ? endIndex : allCases.length,
  )

  if (cases.length == 0) {
    return (
      <>
        <Grid container spacing={2} justifyContent="center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid item>
              <DatePicker label="Start Date" value={start} onChange={(val) => setStart(val)} />
            </Grid>
            <Grid item>
              <DatePicker label="End Date" value={end} onChange={(val) => setEnd(val)} />
            </Grid>
          </LocalizationProvider>
        </Grid>
        <Typography variant="h2">No data.</Typography>
      </>
    )
  }

  const monthsBetween = (t1: Date, t2: Date) => {
    if (t1.getFullYear() == t2.getFullYear()) {
      return t2.getMonth() - t1.getMonth() + 1
    }

    return t2.getMonth() + (12 - t1.getMonth() + 1) + 12 * (t2.getFullYear() - t1.getFullYear() - 1)
  }

  const oldest = cases.reduce((c1, c2) => (c1.startTime < c2.startTime ? c1 : c2)).startTime
  const months = monthsBetween(oldest, new Date())

  const monthCounts = new Array<number>(months).fill(0)
  const monthOpenCounts = new Array<number>(months).fill(0)
  const monthClosedCounts = new Array<number>(months).fill(0)
  const monthLabels = new Array<string>(months).fill("")

  for (let m = 0; m < months; m++) {
    const month = (m + oldest.getMonth()) % monthNames.length
    const year = oldest.getFullYear() + Math.floor(m / 12)
    monthLabels[m] = monthNames[month] + ` '${year % 100}`
  }

  const caseLocations = new Map<string, number>()
  const casesCountPerCoach = new Map<string, number>()
  const casesCountPerBenefit = new Map<string, number>()

  cases.forEach((item) => {
    const startDate = item.startTime
    const startMonth = monthsBetween(oldest, startDate) - 1
    monthCounts[startMonth]++

    const endDate = item.endTime ?? new Date()
    const endMonth = monthsBetween(oldest, endDate) - 1
    if (item.endTime) {
      monthClosedCounts[endMonth]++
      monthOpenCounts[endMonth]--
    }

    for (let i = startMonth; i <= endMonth; i++) {
      monthOpenCounts[i]++
    }

    const zip = item.client.zip
    if (zip in zipCodes) {
      const location = zipCodes[zip as keyof typeof zipCodes]
      const currentCount = caseLocations.get(location) ?? 0
      caseLocations.set(location, currentCount + 1)
    }

    if (item.coaches) {
      item.coaches.forEach((coach) => {
        const currentCount = casesCountPerCoach.get(coach.name) ?? 0
        casesCountPerCoach.set(coach.name, currentCount + 1)
      })
    }

    if (item.benefits) {
      item.benefits.forEach((benefit) => {
        const currentCount = casesCountPerBenefit.get(benefit) ?? 0
        casesCountPerBenefit.set(benefit, currentCount + 1)
      })
    }
  })

  const coachChartData = Array.from(casesCountPerCoach).map(([name, count]) => {
    return { label: name, value: count }
  })

  const benefitsData = Array.from(casesCountPerBenefit).map(([name, count]) => {
    return { label: name, value: count }
  })

  const sortedCaseLocationsArray = Array.from(caseLocations).sort(([, a], [, b]) => b - a)
  const sortedCaseLocationsNum = sortedCaseLocationsArray.map(([_label, value]) => value)
  const sortedCaseLocationsLabels = sortedCaseLocationsArray.map(([label, _value]) => label)

  return (
    <>
      <Grid container spacing={2} justifyContent="center" paddingBottom="4px">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid item>
            <DatePicker label="Start Date" value={start} onChange={(val) => setStart(val)} />
          </Grid>
          <Grid item>
            <DatePicker label="End Date" value={end} onChange={(val) => setEnd(val)} />
          </Grid>
        </LocalizationProvider>
      </Grid>
      <Grid container spacing={2} sx={{ padding: "12px" }}>
        <Grid item xs={1} md={7}>
          <Card sx={{ minHeight: "200px", marginBottom: "20px" }}>
            <ChartContainer>
              <CardContent>
                <Typography variant="h6" align="center">
                  Cases by Month
                </Typography>
                <BarChart
                  series={[
                    {
                      label: "Opened",
                      data: monthCounts,
                      color: theme.palette.primary.main,
                    },
                    {
                      label: "Closed",
                      data: monthClosedCounts,
                      color: theme.palette.secondary.main,
                    },
                  ]}
                  height={430}
                  xAxis={[
                    {
                      data: monthLabels,
                      scaleType: "band",
                    },
                  ]}
                  margin={{ top: 60, bottom: 30, left: 40, right: 10 }}
                />
              </CardContent>
            </ChartContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ alignItems: "center" }}>
            <ChartContainer>
              <CardContent sx={{ justifyContent: "center" }}>
                <Typography variant="h6" align="center">
                  Assigned Cases Per Coach
                </Typography>
                <PieChart
                  margin={{ top: 10, bottom: 90, left: 60, right: 60 }}
                  height={430}
                  series={[
                    {
                      arcLabel: (item) => item.label?.split(" ")[0] ?? "",
                      arcLabelMinAngle: 30,
                      data: coachChartData,
                      paddingAngle: 1,
                      cornerRadius: 4,
                      innerRadius: 25,
                      color: theme.palette.secondary.main,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: theme.palette.primary.light,
                      fontSize: 12,
                    },
                  }}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "middle" },
                      padding: 0,
                      itemMarkWidth: 20,
                      itemMarkHeight: 4,
                      markGap: 5,
                      itemGap: 12,
                      labelStyle: {
                        fontSize: 14,
                      },
                    },
                  }}
                />
              </CardContent>
            </ChartContainer>
          </Card>
        </Grid>
        <Grid item xs={1} md={5}>
          <Card sx={{ alignItems: "center" }}>
            <ChartContainer>
              <CardContent sx={{ justifyContent: "center" }}>
                <Typography variant="h6" align="center">
                  Benefits Per Case
                </Typography>
                <PieChart
                  margin={{ top: 10, bottom: 90, left: 60, right: 60 }}
                  height={430}
                  series={[
                    {
                      arcLabel: (item) => item.label ?? "",
                      arcLabelMinAngle: 30,
                      data: benefitsData,
                      paddingAngle: 1,
                      cornerRadius: 4,
                      innerRadius: 25,
                      color: theme.palette.secondary.main,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: theme.palette.primary.light,
                      fontSize: 12,
                    },
                  }}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "middle" },
                      padding: 0,
                      itemMarkWidth: 20,
                      itemMarkHeight: 4,
                      markGap: 5,
                      itemGap: 12,
                      labelStyle: {
                        fontSize: 14,
                      },
                    },
                  }}
                />
              </CardContent>
            </ChartContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ minHeight: "200px", marginBottom: "12px" }}>
            <ChartContainer>
              <CardContent>
                <Typography variant="h6" align="center">
                  Total Open Cases Per Month
                </Typography>
                <LineChart
                  height={430}
                  xAxis={[
                    {
                      data: monthLabels,
                      scaleType: "band",
                    },
                  ]}
                  series={[{ data: monthOpenCounts, color: theme.palette.primary.main }]}
                />
              </CardContent>
            </ChartContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card sx={{ minHeight: "200px", marginBottom: "20px" }}>
            <ChartContainer>
              <CardContent>
                <Typography variant="h6" align="center">
                  Cases by County
                </Typography>
                <BarChart
                  series={[
                    {
                      label: "Cases in County",
                      data: sortedCaseLocationsNum,
                      color: theme.palette.primary.main,
                    },
                  ]}
                  height={430}
                  xAxis={[
                    {
                      data: sortedCaseLocationsLabels,
                      scaleType: "band",
                    },
                  ]}
                  margin={{ top: 60, bottom: 30, left: 40, right: 10 }}
                />
              </CardContent>
            </ChartContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
