import cors from "cors"
import "dotenv/config"
import express, { type NextFunction, type Request, type Response } from "express"
import cases from "./api/cases.js"

const app = express()
const port = process.env.PORT ?? 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}))

app.get("/", (req: Request, res: Response) => {
  res.send("AssistHub Backend")
})

app.use("/api/cases", cases)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message, err.stack)
  return res.status(500).json({ message: err.message })
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

export default app
