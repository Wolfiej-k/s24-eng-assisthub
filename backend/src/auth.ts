import { auth } from "express-oauth2-jwt-bearer"
import express, { type NextFunction, type Request, type Response } from "express"
import { CoachModel } from "./schemas/coach.js"

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
})


const ensureLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.get("Secret") === process.env.ADMIN_SECRET)
  {
    console.log("secret passed")
    req.auth = { admin: true }
    next()
  }
  else {
    console.log("no secret")
    jwtCheck(req, res, next)
  }
}

const getIdentity = (req: Request, res: Response, next: NextFunction) => {
  //assume ensure login worked
  // check if req.auth is undefined

  // search db for coach
  try {
    const coach = await CoachModel.findOne({ req.email })
    req.auth.identity = coach
  }
  catch {
    return jwtCheck(req, res, next)
  }
  return next()
}
const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {

  if (req.auth.admin)
  {
    next()
  }
  res.status(401).json("Not authorized")

}
