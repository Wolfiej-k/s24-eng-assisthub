import { Router } from "express"
import { ensureAdmin } from "../auth.js"
import { CaseModel, type Case } from "../schemas/case.js"

const router = Router()

router.get("/", async (_req, res) => {
  const items = await CaseModel.find()
  res.status(200).json(items)
})

router.post("/", ensureAdmin, async (req, res) => {
  const { client, coaches, data, startTime, endTime, notes } = req.body as Case
  const item = new CaseModel({
    client: client,
    coaches: coaches,
    data: data,
    startTime: startTime,
    endTime: endTime,
    notes: notes,
  })

  try {
    await item.save()
    res.status(201).json(item)
  } catch {
    res.status(400).json({ error: "Validation failed" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const item = await CaseModel.findById(req.params.id)
    if (item) {
      res.status(200).json(item)
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

router.patch("/:id", async (req, res) => {
  try {
    const item = await CaseModel.findById(req.params.id)
    if (item) {
      const { client, coaches, data, startTime, endTime, notes } = req.body as Case
      item.client = client ?? item.client
      item.coaches = coaches ?? item.coaches
      item.data = data ?? item.data
      item.startTime = startTime ?? item.startTime
      item.endTime = endTime ?? item.endTime
      item.notes = notes ?? item.notes

      try {
        await item.save()
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

router.delete("/:id", ensureAdmin, async (req, res) => {
  try {
    await CaseModel.deleteOne({ _id: req.params.id })
    res.status(204).json()
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

export default router
