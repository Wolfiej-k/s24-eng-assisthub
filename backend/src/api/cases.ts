import { Router } from "express"
import { CaseModel, type Case } from "../schemas/case.js"

const router = Router()

router.get("/", async (req, res) => { //Get a list of cases
  const items = await CaseModel.find({})
  res.status(200).json(items) // Check for error
  // Take in a list of specifications
  const _sort = req.query._sort;
  const _order = req.query._order;
  const _start = req.query._start;
  const _end = req.query._end;
  let sorted_order = 1
  type SortOrder = 1 | -1;

  if (_sort){
    if (_order){
      if (_order == 'desc') {sorted_order = -1} //Override automatic ascending order if order is specified as descending
    }

    if (typeof _sort === 'string'){
      const result = await CaseModel.find({}).sort({ [_sort]: sorted_order as SortOrder}) //Sort CaseModel

      if(_start && _end){
        return result[_start as unknown as number, _end as unknown as number] //If start and end points are specified, return only between those indices
      }
      return result //Otherwise, return the entire array
    }
  }
})

router.post("/", async (req, res) => { //Post a case
  const { client, coaches, data, startTime, endTime, notes } = req.body as Case
  const item = new CaseModel({ //Create new case with input
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
    res.status(400).json({ error: "Validation failed" }) //Validate for errors
  }
})

router.get("/:id", async (req, res) => { //Get specific case
  try {
    const item = await CaseModel.findById(req.params.id) //Choose case by id
    if (item) {
      res.status(200).json(item)
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch {
    res.status(404).json({ error: "Not found" }) //Validate for errors
  }
})

router.patch("/:id", async (req, res) => { //Update case
  try {
    const item = await CaseModel.findById(req.params.id)
    if (item) {
      const { client, coaches, data, startTime, endTime, notes } = req.body as Case //Update case by id
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
        res.status(400).json({ error: "Validation failed" }) //Validate for errors
      }
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch {
    res.status(404).json({ error: "Not found" })
  }
})

router.delete("/:id", async (req, res) => { //Delete case
  try {
    try {
      await CaseModel.findById(req.params.id)
    }
    catch {
      res.status(404).json({ error: "Not found" })
    }
    await CaseModel.deleteOne({ _id: req.params.id }) //Delete case by id
    res.status(204).json()
  } catch {
    res.status(404).json({ error: "Deletion failed" }) //Validate for errors
  }
})

export default router
