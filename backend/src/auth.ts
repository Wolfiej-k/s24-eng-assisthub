import { type NextFunction, type Request, type Response } from "express"
import { auth } from "express-oauth2-jwt-bearer"
import { CoachModel } from "./schemas/coach"

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
})

export function ensureLogin(req: Request, res: Response, next: NextFunction) {
  if (req.get("Secret") === process.env.ADMIN_SECRET) {
    req.auth = { admin: true }
    return next()
  }

  return jwtCheck(req, res, next)
}

export async function getIdentity(req: Request, _res: Response, next: NextFunction) {
  if (req.auth.admin) {
    return next()
  }

  const query = await CoachModel.find({ email: req.auth.payload?.email })
  const coach = query[0]

  if (!coach) {
    return next(Error("Coach-Auth0 account mismatch"))
  }

  req.auth.identity = coach
  req.auth.admin = coach.admin
  return next()
}

export function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.auth.admin) {
    return next()
  }

  return res.status(403).json({ error: "Forbidden" })
}
