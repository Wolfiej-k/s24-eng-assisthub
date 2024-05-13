import { Card, CardContent, Grid, Typography, useTheme } from "@mui/material"
import { BarChart, LineChart, pieArcLabelClasses, PieChart } from "@mui/x-charts"
import { useList } from "@refinedev/core"
import { Error, Loading } from "../../components/message"
import { type Case } from "../../types"
import ChartContainer from "./chart-container"
import zipCodes from "./zipcodes.json"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AnalyticsCharts() {
  const theme = useTheme()

  const { data, isLoading, isError } = useList<Case>({
    resource: "cases",
    pagination: {
      mode: "off",
    },
  })

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  const cases = data.data

  if (cases.length === 0) {
    return <div>Something went wrong!</div>
  }

  const monthsBetween = (t1: Date, t2: Date) => {
    if (t1.getFullYear() == t2.getFullYear()) {
      return t2.getMonth() - t1.getMonth() + 1
    }

    return t2.getMonth() + (12 - t1.getMonth() + 1) + 12 * (t2.getFullYear() - t1.getFullYear() - 1)
  }

  const oldest = new Date(
    cases.reduce((c1, c2) => (new Date(c1.startTime).getTime() < new Date(c2.startTime).getTime() ? c1 : c2)).startTime,
  )

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
    const startDate = new Date(item.startTime)
    const startMonth = monthsBetween(oldest, startDate) - 1
    monthCounts[startMonth]++

    const endDate = item.endTime ? new Date(item.endTime) : new Date()
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
  const sortedCaseLocationsNum = sortedCaseLocationsArray.map(([label, value]) => (value))
  const sortedCaseLocationsLabels = sortedCaseLocationsArray.map(([label, value]) => (label))

  return (
    <Grid container spacing={2} sx={{ padding: "12px" }}>
      <Grid item xs={1} md={7}>
        <Card sx={{ minHeight: "200px", marginBottom: "20px" }}>
          <ChartContainer>
            <CardContent>
              <Typography variant="h6" align="center">
                Open Cases Per Month
              </Typography>
              <BarChart
                series={[
                  {
                    label: "Opened Cases",
                    data: monthCounts,
                    color: theme.palette.primary.main,
                  },
                  {
                    label: "Closed Cases",
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
                Assigned Cases per Coach
              </Typography>
              <PieChart
                margin={{ top: 10, bottom: 60, left: 60, right: 60 }}
                height={430}
                series={[
                  {
                    arcLabel: (item) => item.label?.split(" ")[0] ?? "",
                    arcLabelMinAngle: 25,
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
                margin={{ top: 10, bottom: 60, left: 60, right: 60 }}
                height={430}
                series={[
                  {
                    arcLabel: (item) => item.label?.split(" ")[0] ?? "",
                    arcLabelMinAngle: 25,
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
  )
}
