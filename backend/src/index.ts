import cors from "cors"
import "dotenv/config"
import express, { type NextFunction, type Request, type Response } from "express"
import cases from "./api/cases.js"
import coaches from "./api/coaches.js"
import "./database.js"
import { ensureLogin, getIdentity, ensureAdmin } from "./auth"

const app = express()
const port = process.env.PORT ?? 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}))

app.use(ensureLogin)
app.use(getIdentity)
app.use("/api/cases", cases)
app.use("/api/coaches", coaches)

// Admin-only routes
app.post('/api/cases', ensureAdmin);
app.delete('/api/cases', ensureAdmin);
app.post('/api/coaches', ensureAdmin);
app.patch('/api/coaches', ensureAdmin);
app.delete('/api/coaches', ensureAdmin);

// Coach-specific route, example for viewing a case
app.get('/api/cases/:caseId', ensureCoach);
app.get("*", (_req, res) => {
  res.status(404).send("Not found")
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[server] Routing error:`, err.message, "\n", err.stack)
  return res.status(500).json({ message: err.message })
})

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`)
})

export default app
