import { ManagementClient } from "auth0"
import { type NextFunction, type Request, type Response } from "express"
import { auth } from "express-oauth2-jwt-bearer"
import randomstring from "randomstring"
import { CoachModel, type CoachRes } from "./schemas/coach"

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN ?? "",
  clientId: process.env.AUTH0_CLIENTID ?? "",
  clientSecret: process.env.AUTH0_SECRET ?? "",
})

export async function createUser(user: CoachRes) {
  try {
    const res = await management.users.create({
      user_id: user._id.toString(),
      email: user.email,
      name: user.name,
      password: randomstring.generate(),
      connection: "Username-Password-Authentication",
      user_metadata: { admin: user.admin },
    })

    if (res.status !== 201) {
      return { error: Error("Auth0 management error") }
    }

    return { error: null }
  } catch (e) {
    return { error: e }
  }
}

export async function updateUser(user: CoachRes) {
  try {
    const res = await management.users.update(
      { id: "auth0|" + user._id.toString() },
      {
        email: user.email,
        name: user.name,
        connection: "Username-Password-Authentication",
        user_metadata: { admin: user.admin },
      },
    )

    if (res.status !== 200) {
      return { error: Error("Auth0 management error") }
    }

    return { error: null }
  } catch (e) {
    return { error: e }
  }
}

export async function deleteUser(id: string) {
  try {
    const res = await management.users.delete({ id: "auth0|" + id })

    if (res.status !== 204) {
      return { error: Error("Auth0 management error") }
    }

    return { error: null }
  } catch (e) {
    return { error: e }
  }
}

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: "https://" + process.env.AUTH0_DOMAIN,
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

  const id = req.auth.payload?.sub.substring(6)
  const coach = await CoachModel.findById(id)

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
