import { type NextFunction, type Request, type Response } from "express"
import { auth } from "express-oauth2-jwt-bearer"
import { CoachModel, type Coach } from "./schemas/coach.js"

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
})

export const ensureLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.get("Secret") === process.env.ADMIN_SECRET) {
    next()
  } else {
    jwtCheck(req, res, next)
  }
}

//getIdentity should search the database for the coach who made the request. You may assume that ensureLogin was already called; if req.auth doesn’t exist, simply set req.auth.admin = true and proceed. Otherwise, we have the coach’s email in the API payload (see References), so just find it using CoachModel (similarly to the database lookups in src/api/cases.ts). Then set req.auth.identity to be the result. Lastly, add an isAdmin boolean to the coach schema in src/schemas/coach.ts, and set req.auth.admin to the corresponding field of the coach object.
export const getIdentity = async (req: Request, res: Response, next: NextFunction) => {
  if (req.auth !== undefined) {
    req.auth.admin = true
  }
  // search db for coach
  try {
    const coach = await CoachModel.findById(req.params.id)

    if (coach) {
      const { name, email, isAdmin } = req.body as Coach
      coach.email = email ?? coach.email
    }

    req.auth.identity = coach
    req.auth.admin = coach.isAdmin
  } catch {
    return jwtCheck(req, res, next)
  }
  return next()
}

export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.auth.admin) {
    return next()
  }
  return res.status(401).json("Not authorized")
}
