import {Box, IconButton} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import {useRef} from "react";

const getDefs = () => {
  const styles = getStyles()

  return `<defs><style type=\\"text/css\\"><![CDATA[${styles}}]]></style></defs>`
}

const stringifyStylesheet = (stylesheet) =>
  stylesheet.cssRules
    ? Array.from(stylesheet.cssRules)
      .map(rule => rule.cssText || '')
      .join('\n')
    : ''

const getStyles = () =>
  Array.from(document.styleSheets)
    .map(s => stringifyStylesheet(s))
    .join("\n")

export default function ChartContainer({children}) {
  const ref = useRef()

  const download = () => {
    const svgElems = ref.current.querySelectorAll('svg[class$="MuiChartsSurface-root"]')

    if (svgElems.length === 0) {
      console.log("No svg chart found in container")
      return;
    }

    const svgElem = svgElems[0]
    // adding styles
    const defs = getDefs()
    svgElem.insertAdjacentHTML("afterbegin", defs)

    const output = {"name": "chart.png", "width": svgElem.clientWidth, "height": svgElem.clientHeight}
    // const uriData = `data:image/svg+xml;base64,${btoa(svgElem.outerHTML)}` // it may fail.
    const uriData = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svgElem))))}`
    const img = new Image()
    img.src = uriData
    console.log(uriData)
    img.onload = () => {
      const canvas = document.createElement("canvas");
      [canvas.width, canvas.height] = [output.width, output.height]
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, output.width, output.height)

      // download
      const a = document.createElement("a")
      const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
      a.href = canvas.toDataURL("image/png", quality)
      a.download = output.name
      a.append(canvas)
      a.click()
      a.remove()
    }
  }

  return (
    <Box ref={ref} position='relative'>
      <IconButton sx={{position: 'absolute', right: '20px'}}  aria-label="download" onClick={download}>
        <DownloadIcon fontSize="inherit" />
      </IconButton>

      {children}
    </Box>
  )
}
