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
    },
    startTime: new Date("2024-02-29"),
    language: "English",
    benefits: "CalFresh",
  },
  {
    id: 2,
    client: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "098-765-4321",
      zip: "01237",
    },
    startTime: new Date("2005-01-01"),
    language: "Spanish",
    benefits: "Section 8/Housing",
  },
]

router.get("/", (_req, res) => {
  return res.status(201).json(cases)
})

async function create(newCase: CaseItem) {
  cases.push(newCase)
  return "added case to list"
}

router.post("/", (req, res) => {
  if (validateCase(req.body)) {
    const item: CaseItem = { id: idCount++, startTime: new Date(), ...req.body }
    cases.push(item)

    res.status(201).json(item)
  } else {
    res.status(500).send(validateCase.errors)
  }
})

async function update(id: number, updateCase: CaseItem) {

  cases.forEach((i) => {
    if (i.id == updateCase.id) {
      i = updateCase
    }
  })
  return "case edited"
}

router.put("/:id", async function (req, res, next) {
  if (validateCase(req.body)) {
    cases.forEach((i) => {
      if (i.id == (req.params.id as unknown) as number) {
        const item: CaseItem = { id: req.params.id, startTime: new Date(), ...req.body }
        res.status(201).json(item)
      }
    })
  } else {
    res.status(500).send(validateCase.errors)
  }
})

async function remove(id: number) {

  delete cases[cases.findIndex((item) => item.id == id)]
  return "Case deleted"
}

router.delete("/:id", async function (req, res, next) {
  if (validateCase(req.body)) {
    cases.forEach((i) => {
      if (i.id == (req.params.id as unknown) as number){
        res.status(201).json(i)
        cases.splice(cases.indexOf(i))
      }
    })
  } else {
    res.status(500).send(validateCase.errors)
  }
})

export default router
