import cors from "cors"
import "dotenv/config"
import express, { type NextFunction, type Request, type Response } from "express"
import { UnauthorizedError } from "express-oauth2-jwt-bearer"
import cases from "./api/cases"
import coaches from "./api/coaches"
import "./database"

const app = express()
const port = process.env.PORT ?? 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}))

app.use("/api/cases", cases)
app.use("/api/coaches", coaches)

app.get("*", (_req, res) => {
  return res.status(404).send("Not found")
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  console.error(`[server] Routing error:`, err.message, "\n", err.stack)
  return res.status(500).json({ error: "Internal server error" })
})

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`)
})

export default app
