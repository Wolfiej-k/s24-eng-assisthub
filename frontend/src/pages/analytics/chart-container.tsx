import DownloadIcon from "@mui/icons-material/Download"
import { Box, IconButton } from "@mui/material"
import { useRef } from "react"

interface ChartContainerProps {
  children: React.ReactNode
}

const stringifyStylesheet = (stylesheet: CSSStyleSheet) =>
  stylesheet.cssRules
    ? Array.from(stylesheet.cssRules)
        .map((rule) => rule.cssText || "")
        .join("\n")
    : ""

const getStyles = () =>
  Array.from(document.styleSheets)
    .map((s) => stringifyStylesheet(s))
    .join("\n")

const getDefs = () => {
  const styles = getStyles()
  return `<defs><style type="text/css">${styles}</style></defs>`
}

export default function ChartContainer({ children }: ChartContainerProps) {
  const ref = useRef<HTMLDivElement>(null)

  const download = () => {
    if (!ref.current) {
      return
    }

    const svgElems = ref.current.querySelectorAll<SVGSVGElement>('svg[class$="MuiChartsSurface-root"]')
    const svgElem = svgElems[0]

    if (!svgElem) {
      return
    }

    const defs = getDefs()
    svgElem.insertAdjacentHTML("afterbegin", defs)

    const output = { name: "chart.png", width: svgElem.clientWidth, height: svgElem.clientHeight }
    const uriData = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svgElem))))}`
    const img = new Image()
    img.src = uriData
    img.onload = () => {
      const canvas = document.createElement("canvas")
      ;[canvas.width, canvas.height] = [output.width, output.height]

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        return
      }

      ctx.drawImage(img, 0, 0, output.width, output.height)

      const a = document.createElement("a")
      const quality = 1.0
      a.href = canvas.toDataURL("image/png", quality)
      a.download = output.name
      a.append(canvas)
      a.click()
      a.remove()
    }
  }

  return (
    <Box ref={ref} position="relative">
      <IconButton sx={{ position: "absolute", right: "15px", top: "15px" }} aria-label="download" onClick={download}>
        <DownloadIcon fontSize="inherit" />
      </IconButton>
      {children}
    </Box>
  )
}
