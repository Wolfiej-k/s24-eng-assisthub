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

async function create(newCase: Case) {
  // const result = await db.query(
  //   `INSERT INTO cases
  //   (id, client_id, status, unemployment, dependent, housing, insurance, education, benefit)
  //   VALUES
  //   ('${newCase.id}, ${newCase.client_id}, ${newCase.start_time}, ${newCase.end_time}, ${newCase.status}, ${newCase.unemployment}, ${newCase.dependent}, ${newCase.housing}, ${newCase.insurance},  ${newCase.education},  ${newCase.benefit})`
  // );
  cases.push(newCase)

  // let message = 'Error in creating case';

  // if (result.affectedRows) {
  //   message = 'Case created successfully';
  // }

  //return {message};
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

async function update(id: string, updateCase: Case) {
  // const result = await db.query(
  //   `UPDATE cases
  //   SET status="${updateCase.status}", unemployment="${updateCase.unemployment}", dependent=="${updateCase.dependent}", housing="${updateCase.housing}", insurance="${updateCase.insurance}", education="${updateCase.education}", benefit="${updateCase.benefit}"
  //   WHERE id=${id}`
  // );

  cases.forEach((i) => {
    if (i.id == updateCase.id) {
      i = updateCase
    }
  })

  // let message = 'Error in updating case';

  // if (result.affectedRows) {
  //   message = 'Case updated successfully';
  // }

  //return {message};
  return "case edited"
}

router.put("/:id", async function (req, res, next) {
  try {
    res.json(await update(req.params.id, req.body))
  } catch (error: any) {
    console.error(`Error while updating case`, error.message)
    next(error)
  }
})

async function remove(id: string) {
  // const result = await db.query(
  //   `DELETE FROM cases WHERE id=${id}`
  // );

  delete cases[cases.findIndex((item) => item.id == id)]

  // let message = 'Error in deleting cases';

  // if (result.affectedRows) {
  //   message = 'Case deleted successfully';
  // }

  //return {message};
  return "Case deleted"
}

router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await remove(req.params.id))
  } catch (error: any) {
    console.error(`Error while deleting case`, error.message)
    next(error)
  }
})

export default router
