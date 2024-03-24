import { Router } from "express"
import { type CaseItem } from "../schemas/case.js"
import { CaseModel } from "../schemas/case.js"
import { ObjectId } from "mongodb"

const router = Router()

let idCount = 3
const cases: CaseItem[] = [
  {
    id: 1,
    client: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      zip: "02138",
      profile: "fakewebsite.com/johndoe",
    },
    coaches: [],
    startTime: new Date("2024-02-29"),
    data: {
      language: "English",
      benefits: "CalFresh",
    },
  },
  {
    id: 2,
    client: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "098-765-4321",
      zip: "01237",
      profile: "fakewebsite.com/janesmith",
    },
    coaches: [],
    startTime: new Date("2005-01-01"),
    data: {
      language: "Spanish",
      benefits: "Section 8/Housing",
    },
  },
]

router.get("/", (_req, res) => {
  res.status(200).json(cases)
})

router.post("/", async (req, res) => {
  const item: CaseItem = {
    id: idCount++,
    startTime: new Date(),
    client: req.body.client,
    coaches: req.body.coaches,
    data: req.body.data,
    notes: req.body.notes,
  }
  const result = await CaseModel.updateOne(item)
  return res.status(201).json(item)
  }
)

router.get("/:id", async (req, res) => {
  const caseid = parseInt(req.params.id)
  try {
    const query = { _id: caseid };
    const caseitem = ( await CaseModel.findOne(query)) as CaseItem;
    if (caseitem) {
      res.status(200).send(caseitem);
    }
    } catch (error) {
      res.status(404).send(`Unable to find matching document with id: ${caseid}`);
    }
})

router.put("/:id", async (req, res) => {
  const caseid = parseInt(req.params.id)
  try {
        const updatedCase = req.body as CaseItem;
        const query = { _id: caseid };
        const result = await CaseModel.updateOne(query, {$set: updatedCase})
      }
    catch(error) {
    res.status(400).send(`Unable to find matching document with id: ${caseid}`);
  }
})

router.delete("/:id", async (req, res) => {
  const caseid = parseInt(req.params.id)
  try {
    const query = { _id: caseid };
    const result = await CaseModel.deleteOne(query);
  } catch (error) {
    res.status(400).send(`Unable to find matching document with id: ${caseid}`);
}
})

export default router
