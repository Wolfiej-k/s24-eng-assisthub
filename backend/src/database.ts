import mongoose from "mongoose"

mongoose
  .connect(process.env.DATABASE_URI ?? "")
  .then(() => {
    console.log(`[server] Connected to MongoDB`)
  })
  .catch((err: Error) => {
    console.log(`[server] Database error:`, err.message, "\n", err.stack)
  })
