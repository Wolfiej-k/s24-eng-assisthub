import "express-serve-static-core"
import { type Coach } from "../schemas/coach.js"

declare module "express-serve-static-core" {
  interface Request {
    auth: {
      admin: boolean
      identity?: Coach
      payload?: {
        email: string
      }
    }
  }
}
