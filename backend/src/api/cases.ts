import { Router } from "express"
import { Error } from "mongoose"
import { ensureAdmin, ensureLogin, getIdentity } from "../auth"
import { CaseModel, type Case } from "../schemas/case"

const router = Router()

router.use(ensureLogin)
router.use(getIdentity)

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
    filter.coaches = req.auth.identity!._id.toString()
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
  return res.status(200).json(items)
})

router.get("/:id", async (req, res, next) => {
  try {
    let item = await CaseModel.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Not found" })
    }

    if (!req.auth.admin && item.coaches.indexOf(req.auth.identity!._id) == -1) {
      return res.status(403).json({ error: "Forbidden" })
    }

    item = await item.populate("coaches")
    return res.status(200).json(item)
  } catch (e) {
    if (e instanceof Error.DocumentNotFoundError) {
      return res.status(404).json({ error: "Not found" })
    }

    next(e)
  }
})

router.post("/", ensureAdmin, async (req, res, next) => {
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
    return res.status(201).json(item)
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(400).json({ error: "Validation failed" })
    }

    next(e)
  }
})

router.patch("/:id", async (req, res, next) => {
  try {
    let item = await CaseModel.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Not found" })
    }

    if (!req.auth.admin && item.coaches.indexOf(req.auth.identity!._id) == -1) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const { client, coaches, data, startTime, endTime, notes } = req.body as Partial<Case>
    item.client = client ?? item.client
    item.coaches = coaches ?? item.coaches
    item.data = data ?? item.data
    item.startTime = startTime ?? item.startTime
    item.endTime = endTime ?? item.endTime
    item.notes = notes ?? item.notes

    await item.save()
    item = await item.populate("coaches")
    return res.status(201).json(item)
  } catch (e) {
    if (e instanceof Error.DocumentNotFoundError) {
      return res.status(404).json({ error: "Not found" })
    }

    if (e instanceof Error.ValidationError) {
      return res.status(400).json({ error: "Validation failed" })
    }

    next(e)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    let item = await CaseModel.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Not found" })
    }

    if (!req.auth.admin && item.coaches.indexOf(req.auth.identity!._id) == -1) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const { client, coaches, data, startTime, endTime, notes } = req.body as Case
    item.client = client
    item.coaches = coaches
    item.data = data
    item.startTime = startTime
    item.endTime = endTime
    item.notes = notes

    await item.save()
    item = await item.populate("coaches")
    return res.status(201).json(item)
  } catch (e) {
    if (e instanceof Error.DocumentNotFoundError) {
      return res.status(404).json({ error: "Not found" })
    }

    if (e instanceof Error.ValidationError) {
      return res.status(400).json({ error: "Validation failed" })
    }

    next(e)
  }
})

router.delete("/:id", ensureAdmin, async (req, res, next) => {
  try {
    await CaseModel.deleteOne({ _id: req.params.id })
    return res.status(204).json()
  } catch (e) {
    if (e instanceof Error.DocumentNotFoundError) {
      return res.status(404).json({ error: "Not found" })
    }

    next(e)
  }
})

export default router
