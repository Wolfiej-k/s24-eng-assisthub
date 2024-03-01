import { Router } from "express"

const db = require('./db');
const programmingLanguages = require('../services/cases');
const router = Router()

interface Case {
  id?: number;
  client_id?: number;
  status: string;
  start_time?: string;
  end_time?: string;
  unemployment: boolean;
  dependent: boolean;
  housing: string;
  insurance: boolean,
  education: string,
  benefit: string
}

interface Coach {
  id: number,
  name: string,
  phone: number,
  email: string
  language: string,
  zipcode: number
}

let cases: Case[] = [];

router.get("/", (req, res, next) => {
  return res.send("Cases API")
})

async function create(newCase: Case){
  const result = await db.query(
    `INSERT INTO cases
    (id, client_id, status, unemployment, dependent, housing, insurance, education, benefit)
    VALUES
    ('${newCase.id}, ${newCase.client_id}, ${newCase.start_time}, ${newCase.end_time}, ${newCase.status}, ${newCase.unemployment}, ${newCase.dependent}, ${newCase.housing}, ${newCase.insurance},  ${newCase.education},  ${newCase.benefit})`
  );

  let message = 'Error in creating case';

  if (result.affectedRows) {
    message = 'Case created successfully';
  }

  cases.push(newCase);

  return {message};
}

router.post("", (req, res, next) => {
  const { status, unemployment, dependent, housing, insurance, education, benefit } = req.body;
  const c: Case = {
    status: status,
    unemployment: unemployment,
    dependent: dependent,
    housing: housing,
    insurance: insurance,
    education: education,
    benefit: benefit
  };
  create(c);
  return res.send(c);

})

async function update(id, updateCase: Case){
  const result = await db.query(
    `UPDATE cases
    SET status="${updateCase.status}", unemployment="${updateCase.unemployment}", dependent=="${updateCase.dependent}", housing="${updateCase.housing}", insurance="${updateCase.insurance}", education="${updateCase.education}", benefit="${updateCase.benefit}"
    WHERE id=${id}`
  );

  let message = 'Error in updating case';

  if (result.affectedRows) {
    message = 'Case updated successfully';
  }

  return {message};
}

router.put('/:id', async function(req, res, next) {
  try {
    res.json(await cases.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating case`, err.message);
    next(err);
  }
});

async function remove(id){
  const result = await db.query(
    `DELETE FROM cases WHERE id=${id}`
  );

  let message = 'Error in deleting cases';

  if (result.affectedRows) {
    message = 'Case deleted successfully';
  }

  return {message};
}

router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await cases.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting case`, err.message);
    next(err);
  }
});

export default router
