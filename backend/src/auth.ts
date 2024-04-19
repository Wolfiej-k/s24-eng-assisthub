import { type NextFunction, type Request, type Response } from "express"
import { auth, type AuthResult } from 'express-oauth2-jwt-bearer';
import { CoachModel, type Coach } from "./schemas/coach"
import { CaseModel, type Case } from "./schemas/case"

interface AuthRequest extends Request {
  auth?: AuthResult & {
    admin?: boolean;
    identity?: string;
    id?: string;
  };
}

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
})

export function ensureLogin(req: Request, res: Response, next: NextFunction) {
  if (req.get("Secret") === process.env.ADMIN_SECRET) {
    req.auth = { admin: true }
    next()
  } else {
    jwtCheck(req, res, next)
  }
}

//getIdentity should search the database for the coach who made the request. You may assume that ensureLogin was already called; if req.auth doesn’t exist, simply set req.auth.admin = true and proceed. Otherwise, we have the coach’s email in the API payload (see References), so just find it using CoachModel (similarly to the database lookups in src/api/cases.ts). Then set req.auth.identity to be the result. Lastly, add an isAdmin boolean to the coach schema in src/schemas/coach.ts, and set req.auth.admin to the corresponding field of the coach object.
export const getIdentity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.auth) {
    // jwtCheck has already been called atp
    req.auth = {
      payload: {},
      token: "",
      header: {},
      admin: true
    };
    next();
  } else {
    // search db for coach but by email cuz only email is in param
    const email = req.auth.payload?.name as string;
    try {
      //const coach = await CoachModel.findById(req.params.id)
      const coach = await CoachModel.findOne({ email: email }).exec();
      if (!coach) {
        return res.status(401).json("Not authorized");
      }

      // if (coach) {
      //   const { name, email, isAdmin } = req.body as Coach
      //   coach.email = email ?? coach.email
      // }

      // req.auth.identity = 'coach'
      // req.auth.admin = coach.isAdmin
      req.auth.admin = coach.isAdmin;
      req.auth.identity = 'coach';
      req.auth.id = coach._id.toString();
      next();
    } catch (err) {
      next(err);
    }
    return next()
  }
}

export const ensureAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.auth?.admin) {
    return next()
  }
  return res.status(401).json("Not authorized")
}

export const ensureCoach = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const caseId = req.params.caseId;
  const coachID = req.auth!.id;

  if (!coachID) {
    return res.status(401).json("Not authorized");
  }

  const caseItem = await CaseModel.findById(caseId);
  if (!caseItem) {
    return res.status(404).json("Case not found");
  }

  const coachIds = caseItem.coaches.map(coach => coach.toString());
  if (coachIds.includes(coachID)) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" })
  }
}

// export const ensureCoach = async (req: Request, res: Response, next: NextFunction) => {
//   const caseId = req.params.caseId
//   const coachName = req.auth.name

//   if (!coachName) {
//     return res.status(401).json({ error: "Unauthorized" })
//   }

//   const caseItem = await CaseModel.findById(caseId).exec()
//   if (!caseItem) {
//     return res.status(404).json("Case not found")
//   }

//   const coachNames = caseItem.coaches.map((coach) => coach.name)
//   if (coachNames.includes(coachName)) {
//     next()
//   } else {
//     res.status(403).json("Forbidden: You do not have access to this case")
//   }
// }
