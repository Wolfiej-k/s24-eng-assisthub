import "express-serve-static-core"
import { type CoachRes } from "../schemas/coach.js"

declare module "express-serve-static-core" {
  interface Request {
    auth: {
      admin: boolean
      identity?: CoachRes
      payload?: {
        email: string
      }
    }
  }
}
