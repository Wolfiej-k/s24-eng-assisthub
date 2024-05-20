import { Router } from "express"
import { Error } from "mongoose"
import { createUser, deleteUser, ensureAdmin, ensureLogin, getIdentity, updateUser } from "../auth"
import { CoachModel, type Coach } from "../schemas/coach"

const router = Router()

router.use(ensureLogin)
router.use(getIdentity)

router.get("/", ensureAdmin, async (_req, res) => {
  const items = await CoachModel.find().sort([["name", 1]])
  return res.status(200).json(items)
})

router.get("/:id", async (req, res, next) => {
  if (!req.params.id) {
    return res.status(404).json({ error: "Not found" })
  }

  if (!req.auth.admin && req.auth.identity?._id.toString() != req.params.id) {
    return res.status(403).json({ error: "Forbidden" })
  }

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
    const { error } = await createUser(item)

    if (error) {
      await CoachModel.deleteOne({ _id: item._id })
      return next(error)
    }

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

    const oldItem = {
      name: item.name,
      email: item.email,
      admin: item.admin,
    }

    const { name, email, admin } = req.body as Partial<Coach>
    item.name = name ?? item.name
    item.email = email ?? item.email
    item.admin = admin ?? item.admin

    await item.save()
    const { error } = await updateUser(item)

    if (error) {
      item.name = oldItem.name
      item.email = oldItem.email
      item.admin = oldItem.admin

      await item.save()
      return next(error)
    }

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

    const oldItem = {
      name: item.name,
      email: item.email,
      admin: item.admin,
    }

    const { name, email, admin } = req.body as Coach
    item.name = name
    item.email = email
    item.admin = admin ?? false

    await item.save()
    const { error } = await updateUser(item)

    if (error) {
      item.name = oldItem.name
      item.email = oldItem.email
      item.admin = oldItem.admin

      await item.save()
      return next(error)
    }

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
  if (!req.params.id) {
    return res.status(404).json({ error: "Not found" })
  }

  try {
    const oldItem = await CoachModel.findById(req.params.id)

    if (!oldItem) {
      return res.status(404).json({ error: "Not found" })
    }

    await CoachModel.deleteOne({ _id: req.params.id })
    const { error } = await deleteUser(req.params.id)

    if (error) {
      await oldItem.save()
      return next(error)
    }

    return res.status(204).json()
  } catch (e) {
    if (e instanceof Error.DocumentNotFoundError) {
      return res.status(404).json({ error: "Not found" })
    }

    next(e)
  }
})

export default router
