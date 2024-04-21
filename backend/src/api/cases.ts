import { Router } from "express"
import { CaseModel, type Case } from "../schemas/case.js"

const router = Router()

router.get("/", async (req, res) => {
  const { _sort, _order, _start, _end } = req.query
  const condition = new Array<[string, 1 | -1]>()

  if (typeof _sort === "string") {
    const dir = _order == "desc" ? -1 : 1
    condition.push([_sort, dir])
  } else {
    condition.push(["endTime", 1])
    condition.push(["startTime", -1])
  }

  const filter: Record<string, string> = {}
  if (!req.auth.admin) {
    filter.coaches = req.auth.identity._id
  }

  let items = await CaseModel.find(filter).populate("coaches").sort(condition)
  const length = items.length.toString()

  const start = typeof _start === "string" ? parseInt(_start) : NaN
  const end = typeof _end === "string" ? parseInt(_end) : NaN

  if (!isNaN(start) && !isNaN(end)) {
    items = items.slice(start, end)
  }

  res.set("X-Total-Count", length)
  res.set("Access-Control-Expose-Headers", "X-Total-Count")
  res.status(200).json(items)
})

router.post("/", async (req, res) => {
  const { client, coaches, data, startTime, endTime, notes } = req.body as Case
  let item = new CaseModel({
    client: client,
    coaches: coaches,
    data: data,
    startTime: startTime,
    endTime: endTime,
    notes: notes,
  })

  try {
    await item.save()
    item = await item.populate("coaches")
    res.status(201).json(item)
  } catch {
    res.status(400).json({ error: "Validation failed" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    let item = await CaseModel.findById(req.params.id)
    if (item) {
      if (req.auth.admin || req.auth.identity._id in item.coaches) {
        item = await item.populate("coaches")
        res.status(200).json(item)
      } else {
        res.status(401).json({ error: "Unauthorized" })
      }
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

router.patch("/:id", async (req, res) => {
  try {
    let item = await CaseModel.findById(req.params.id)
    if (item) {
      if (req.auth.admin || req.auth.identity._id in item.coaches) {
        const { client, coaches, data, startTime, endTime, notes } = req.body as Partial<Case>
        item.client = client ?? item.client
        item.coaches = coaches ?? item.coaches
        item.data = data ?? item.data
        item.startTime = startTime ?? item.startTime
        item.endTime = endTime ?? item.endTime
        item.notes = notes ?? item.notes

        try {
          await item.save()
          item = await item.populate("coaches")
          res.status(201).json(item)
        } catch {
          res.status(400).json({ error: "Validation failed" })
        }
      } else {
        res.status(401).json({ error: "Unauthorized" })
      }
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

router.put("/:id", async (req, res) => {
  try {
    let item = await CaseModel.findById(req.params.id)
    if (item) {
      if (req.auth.admin || req.auth.identity._id in item.coaches) {
        const { client, coaches, data, startTime, endTime, notes } = req.body as Case
        item.client = client
        item.coaches = coaches
        item.data = data
        item.startTime = startTime
        item.endTime = endTime
        item.notes = notes

        try {
          await item.save()
          item = await item.populate("coaches")
          res.status(201).json(item)
        } catch {
          res.status(400).json({ error: "Validation failed" })
        }
      } else {
        res.status(401).json({ error: "Unauthorized" })
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
    await CaseModel.deleteOne({ _id: req.params.id })
    res.status(204).json()
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

export default router
