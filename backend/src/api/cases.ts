import { Router } from "express"
import { Error } from "mongoose"
import { ensureAdmin, ensureLogin, getIdentity } from "../auth"
import { CaseModel, type Case } from "../schemas/case"

const router = Router()

router.use(ensureLogin)
router.use(getIdentity)

router.get("/", async (req, res) => {
  /**
  * Handles GET requests for a list of cases.
  * Supports sorting, filtering, and returning a range of cases based on parameters.
  *
  * Parameters:
  * - _sort: The field to sort by (optional).
  * - _order: The order of sorting, 'asc' for ascending and 'desc' for descending (optional, default is ascending).
  * - _start: The starting index (optional).
  * - _end: The ending index (optional).
  *
  * Authorization:
  * - If the user is not an admin, filters the cases to only include those associated with the user's identity.
  *
  * Returns:
  * - A JSON array of case items with the applied sorting, filtering, and range if applicable.
  * - Sets the response status to 200 if no issue is found.
  */
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
  /**
  * Handles GET requests to retrieve a specific case by its ID.
  *
  * Request Params:
  * - id: The ID of the case to be retrieved.
  *
  * Authorization:
  * - If the user is not an admin, ensures the user is one of the case's coaches.
  *
  * Returns:
  * - The requested case item with a status of 200 if no issue occurs.
  */
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
  /**
  * Handles POST requests to create a new case.
  *
  * Request Body:
  * - case: Case item with all fields
  *
  * Authorization:
  * - Only accessible by admin.
  *
  * Returns:
  * - The created case item with a status of 201 if no error occurs.
  */
  const { client, coaches, benefits, data, startTime, endTime, notes, files } = req.body as Case
  const item = new CaseModel({
    client: client,
    coaches: coaches,
    benefits: benefits,
    data: data,
    startTime: startTime,
    endTime: endTime,
    notes: notes,
    files: files,
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
  /**
  * Handles PATCH requests to update an existing case by its ID.
  *
  * Request Params:
  * - id: The ID of the case to be updated.
  *
  * Request Body (Partial):
  * - case: Can optionally contain any fields of a Case, which it will update with corresponding ID
  *
  * Authorization:
  * - If the user is not an admin, ensures the user is one of the case's coaches.
  *
  * Returns:
  * - The updated case item with a status of 201 if no issue occurs.
  */
  try {
    let item = await CaseModel.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Not found" })
    }

    if (!req.auth.admin && item.coaches.indexOf(req.auth.identity!._id) == -1) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const { client, coaches, benefits, data, startTime, endTime, notes, files } = req.body as Partial<Case>
    item.client = client ?? item.client
    item.coaches = coaches ?? item.coaches
    item.benefits = benefits ?? item.benefits
    item.data = data ?? item.data
    item.startTime = startTime ?? item.startTime
    item.endTime = endTime ?? item.endTime
    item.notes = notes ?? item.notes
    item.files = files ?? item.files

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
  /**
  * Handles PUT requests to update an existing case by its ID.
  * Replaces the entire case with the provided data.
  *
  * Request Params:
  * - id: The ID of the case to be updated.
  *
  * Request Body:
  * - case: Case item with all fields
  *
  * Authorization:
  * - If the user is not an admin, ensures the user is one of the case's coaches.
  *
  * Returns:
  * - The updated case item with a status of 201 if no issue occurs.
  */
  try {
    let item = await CaseModel.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Not found" })
    }

    if (!req.auth.admin && item.coaches.indexOf(req.auth.identity!._id) == -1) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const { client, coaches, benefits, data, startTime, endTime, notes, files } = req.body as Case
    item.client = client
    item.coaches = coaches
    item.benefits = benefits
    item.data = data
    item.startTime = startTime
    item.endTime = endTime
    item.notes = notes
    item.files = files

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
  /**
  * Handles DELETE requests to remove a case by its ID.
  *
  * Request Params:
  * - id: The ID of the case to be deleted.
  *
  * Authorization:
  * - Only accessible by admin.
  * 
  * Returns:
  * - A status of 204 if no issue occurs.
  */
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
