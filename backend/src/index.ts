import "dotenv/config"
import express, { type NextFunction, type Request, type Response } from "express"
import cases from "./api/cases.js"

const app = express()
const port = process.env.PORT ?? 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.send("AssistHub Backend")
})

app.use("/api/cases", cases)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message, err.stack)
  res.status(500).json({ message: err.message })
  return
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

export default app
