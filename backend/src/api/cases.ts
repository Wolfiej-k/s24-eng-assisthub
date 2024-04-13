import { Router } from "express"
import type { Request } from "express"
import { CaseModel, type Case } from "../schemas/case.js"
import { CoachModel, type Coach } from "../schemas/coach.js"

const router = Router()

export interface AuthorizedRequest extends Request {
  case?: Case
  auth.admin?: boolean
  auth.identity?: Coach
}

router.get("/", async (req: Request, res) => {
  let items
  if (!req.auth.admin as boolean){
    items = await CaseModel.find({ coaches: req.auth.identity._id })
  }
  else {
    items = await CaseModel.find().populate("coaches")
  }
  res.status(200).json(items)
})

router.post("/", async (req: Request, res) => {
  const { client, coaches, data, startTime, endTime, notes } = req.body as Case
  let item = new CaseModel({
    client: client,
    coaches: coaches,
    data: data,
    startTime: startTime,
    endTime: endTime,
    notes: notes,
  })

  if (!req.auth.admin as boolean && req.auth.identity._id ! in item.coaches){
    res.status(401).json("Not authorized")
  }

  try {
    await item.save()
    item = await item.populate("coaches")
    res.status(201).json(item)
  } catch {
    res.status(400).json({ error: "Validation failed" })
  }
})

router.get("/:id", async (req: Request, res) => {
  try {
    const item = await CaseModel.findById(req.params.id).populate("coaches")
    if (item) {
      if (!req.auth.admin as boolean && req.auth.identity._id ! in item.coaches){
        res.status(401).json("Not authorized")
      }
      res.status(200).json(item)
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

router.patch("/:id", async (req: Request, res) => {
  try {
    let item = await CaseModel.findById(req.params.id)
    if (item) {
      const { client, coaches, data, startTime, endTime, notes } = req.body as Partial<Case>
      item.client = client ?? item.client
      item.coaches = coaches ?? item.coaches
      item.data = data ?? item.data
      item.startTime = startTime ?? item.startTime
      item.endTime = endTime ?? item.endTime
      item.notes = notes ?? item.notes

      if (!req.auth.admin as boolean && req.auth.identity._id ! in item.coaches){
        res.status(401).json("Not authorized")
      }

      try {
        await item.save()
        item = await item.populate("coaches")
        res.status(201).json(item)
      } catch {
        res.status(400).json({ error: "Validation failed" })
      }
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

router.put("/:id", async (req: Request, res) => {
  try {
    let item = await CaseModel.findById(req.params.id)
    if (item) {
      const { client, coaches, data, startTime, endTime, notes } = req.body as Case
      item.client = client
      item.coaches = coaches
      item.data = data
      item.startTime = startTime
      item.endTime = endTime
      item.notes = notes

      if (!req.auth.admin as boolean && req.auth.identity._id ! in item.coaches){
        res.status(401).json("Not authorized")
      }

      try {
        await item.save()
        item = await item.populate("coaches")
        res.status(201).json(item)
      } catch {
        res.status(400).json({ error: "Validation failed" })
      }
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

router.delete("/:id", async (req: Request, res) => {
  try {
    const item = await CaseModel.findById(req.params.id)
    if (item && !req.auth.admin as boolean && req.auth.identity._id ! in item.coaches){
      res.status(401).json("Not authorized")
    }
    await CaseModel.deleteOne({ _id: req.params.id })
    res.status(204).json()
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

export default router
