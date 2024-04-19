import mongoose from "mongoose"
import { CaseModel } from "./schemas/case"

mongoose
  .connect(process.env.DATABASE_URI ?? "")
  .then(() => {
    //CaseModel.deleteMany({})
    console.log(`[server] Connected to MongoDB`)
  })
  .catch((err: Error) => {
    console.log(`[server] Database error:`, err.message, "\n", err.stack)
  })
