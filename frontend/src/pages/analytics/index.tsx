import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { LineChart } from "@mui/x-charts"
import { BarChart } from "@mui/x-charts/BarChart"
import { PieChart } from "@mui/x-charts/PieChart"
import * as React from "react"

interface Client {
  name: string
  email: string
  phone: string
  zip: string
}

interface Case {
  client: Client
  language: string
  benefits: string
}

interface CaseItem extends Case {
  id: number
  startTime: Date
  endTime?: Date
}

const languages = ["English", "Spanish", "Chinese", "Korean"]
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const benefits = ["Health Insurance", "Legal Aid", "Housing Assistance", "food vouchers"]

const clients: Client[] = Array.from({ length: 40 }, (_, i) => ({
  name: `Client ${i + 1}`,
  email: `client${i + 1}@example.com`,
  phone: `123-456-78${i}0`,
  zip: `1234${i}`,
}))

const startdate = new Array(40).fill(0)
for (let j = 0; j < 40; j++) {
  startdate[j] = Math.floor(Math.random() * 12)
}

const cases: Case[] = clients.map((client, i) => ({
  client,
  language: languages[i % languages.length] ?? "",
  benefits: benefits[i % benefits.length] ?? "",
}))

const caseItems: CaseItem[] = cases.map((c, i) => ({
  ...c,
  id: i + 1,
  startTime: new Date(2023, startdate[i] as number, (startdate[i] + 1) as number),
  endTime: i % 4 === 0 ? new Date(2023, (startdate[i] + 1) as number, (startdate[i] + 2) as number) : undefined,
}))

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

  const caseByLanguage = React.useMemo(() => {
    return cases.reduce(
      (accumulator, currentCase) => {
        const caseLanguage = currentCase.language
        if (!accumulator[caseLanguage]) {
          accumulator[caseLanguage] = 0
        }

        accumulator[caseLanguage]++
        return accumulator
      },
      {} as Record<string, number>,
    )
  }, [])

  const caseByBenefits = React.useMemo(() => {
    return cases.reduce(
      (accumulator, currentCase) => {
        const caseByBenefits = currentCase.benefits
        if (!accumulator[caseByBenefits]) {
          accumulator[caseByBenefits] = 0
        }

        accumulator[caseByBenefits]++
        return accumulator
      },
      {} as Record<string, number>,
    )
  }, [])

  const monthCounts = new Array(12).fill(0)
  caseItems.forEach((caseItem) => {
    const month = caseItem.startTime.getMonth()
    monthCounts[month]++
  })

  const monthOpenCounts = new Array(12).fill(0)
  caseItems.forEach((caseItem) => {
    const startMonth = caseItem.startTime.getMonth()
    const endMonth = caseItem.endTime ? caseItem.endTime.getMonth() : 11
    for (let month = startMonth; month <= endMonth; month++) {
      monthOpenCounts[month]++
    }
  })

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
        <MenuItem onClick={() => handleClose("language")}>Case by Language</MenuItem>
        <MenuItem onClick={() => handleClose("benefits")}>Case by Benefit</MenuItem>
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

      {selectedPlot === "language" && (
        <PieChart
          width={600}
          height={600}
          series={[
            {
              data: Object.entries(caseByLanguage).map(([language, count]) => ({
                id: language,
                value: count,
              })),
              arcLabel: ({ id, value }) => `${id} (${value})`,
            },
          ]}
        />
      )}
      {selectedPlot === "benefits" && (
        <PieChart
          width={600}
          height={600}
          series={[
            {
              data: Object.entries(caseByBenefits).map(([benefit, count]) => ({
                id: benefit,
                value: count,
              })),
              arcLabel: ({ id, value }) => `${id} (${value})`,
            },
          ]}
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
    </div>
  )
}
