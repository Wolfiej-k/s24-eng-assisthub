import { Router } from "express"
import { validateCase, type CaseItem } from "../schemas/case.js"

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

router.post("/", (req, res) => {
  if (validateCase(req.body)) {
    const item: CaseItem = {
      id: idCount++,
      startTime: new Date(),
      client: req.body.client,
      coaches: req.body.coaches,
      data: req.body.data,
      notes: req.body.notes,
    }
    cases.push(item)

    return res.status(201).json(item)
  }

  res.status(400).send(validateCase.errors)
})

router.get("/:id", (req, res) => {
  const newId = parseInt(req.params.id)
  for (const item of cases) {
    if (item.id == newId) {
      return res.status(201).json(item)
    }
  }

  res.status(404).send("Not found")
})

router.put("/:id", (req, res) => {
  if (validateCase(req.body)) {
    const newId = parseInt(req.params.id)
    for (const item of cases) {
      if (item.id == newId) {
        const newItem: CaseItem = {
          id: item.id,
          startTime: item.startTime,
          endTime: item.endTime,
          client: req.body.client,
          coaches: req.body.coaches,
          data: req.body.data,
          notes: req.body.notes,
        }
        cases[cases.indexOf(item)] = newItem

        return res.status(201).json(newItem)
      }
    }

    return res.status(404).send("Not found")
  }

  res.status(400).send(validateCase.errors)
})

router.delete("/:id", (req, res) => {
  const newId = parseInt(req.params.id)
  for (const item of cases) {
    if (item.id == newId) {
      cases.splice(cases.indexOf(item), 1)

      return res.status(201).json(item)
    }
  }

  res.status(404).send("Not found")
})

export default router
