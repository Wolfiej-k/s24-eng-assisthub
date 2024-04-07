import { Router } from "express"
import { CaseModel, type Case } from "../schemas/case.js"
import { CoachModel } from "../schemas/coach.js"

const router = Router()

router.get("/", async (_req, res) => {
  const items = await CaseModel.find().populate("coaches")
  res.status(200).json(items)
})

router.post("/", async (req, res) => {
  const { client, coaches, data, startTime, endTime, notes } = req.body as Case
  // Test that creating a case with a nonexistent coach reference throws an error
  try {
    await CoachModel.find({ _id: { $in: coaches } })
  } catch {
    res.status(400).json({ error: "One or more coaches do not exist." })
    return
  }
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
    const populatedItem = await CaseModel.findById(item._id).populate("coaches")
    res.status(201).json(populatedItem)
  } catch {
    res.status(400).json({ error: "Validation failed" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const item = await CaseModel.findById(req.params.id).populate("coaches")
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
      // ensure that the coaches exist
      try {
        await CoachModel.find({ _id: { $in: item.coaches } })
      } catch {
        res.status(400).json({ error: "One or more coaches do not exist." })
        return
      }

      try {
        await item.save()
        const populatedItem = await CaseModel.findById(item._id).populate("coaches")
        res.status(201).json(populatedItem)
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

router.delete("/:id", async (req, res) => {
  try {
    // do I need to do this to delete the case?
    await CaseModel.deleteOne({ _id: req.params.id })
    res.status(204).json()
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

export default router
