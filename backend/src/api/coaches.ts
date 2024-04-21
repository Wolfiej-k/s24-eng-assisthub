import { Router } from "express"
import { Error } from "mongoose"
import { ensureAdmin, ensureLogin, getIdentity } from "../auth"
import { CoachModel, type Coach } from "../schemas/coach"

const router = Router()

router.use(ensureLogin)
router.use(getIdentity)

router.get("/", async (_req, res) => {
  const items = await CoachModel.find().sort([["name", 1]])
  return res.status(200).json(items)
})

router.get("/:id", async (req, res, next) => {
  try {
    const item = await CoachModel.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Not found" })
    }

    return res.status(200).json(item)
  } catch (e) {
    if (e instanceof Error.DocumentNotFoundError) {
      return res.status(404).json({ error: "Not found" })
    }

    next(e)
  }
})

router.post("/", ensureAdmin, async (req, res, next) => {
  const { name, email, admin } = req.body as Coach
  const item = new CoachModel({
    name: name,
    email: email,
    admin: admin ?? false,
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

router.patch("/:id", ensureAdmin, async (req, res, next) => {
  try {
    const item = await CoachModel.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Not found" })
    }

    const { name, email, admin } = req.body as Partial<Coach>
    item.name = name ?? item.name
    item.email = email ?? item.email
    item.admin = admin ?? item.admin

    await item.save()
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

router.put("/:id", ensureAdmin, async (req, res, next) => {
  try {
    const item = await CoachModel.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Not found" })
    }

    const { name, email, admin } = req.body as Coach
    item.name = name
    item.email = email
    item.admin = admin

    await item.save()
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
    await CoachModel.deleteOne({ _id: req.params.id })
    return res.status(204).json()
  } catch (e) {
    if (e instanceof Error.DocumentNotFoundError) {
      return res.status(404).json({ error: "Not found" })
    }

    next(e)
  }
})

export default router
