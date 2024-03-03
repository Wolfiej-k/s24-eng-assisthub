import { Router } from "express"

const router = Router()

interface Case {
  id?: string;
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
  return ("added case to list")
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

async function update(id: string, updateCase: Case){
  // const result = await db.query(
  //   `UPDATE cases
  //   SET status="${updateCase.status}", unemployment="${updateCase.unemployment}", dependent=="${updateCase.dependent}", housing="${updateCase.housing}", insurance="${updateCase.insurance}", education="${updateCase.education}", benefit="${updateCase.benefit}"
  //   WHERE id=${id}`
  // );

  cases.forEach( (i) => {
    if (i.id == updateCase.id) {
      i = updateCase
    }
  })

  // let message = 'Error in updating case';

  // if (result.affectedRows) {
  //   message = 'Case updated successfully';
  // }

  //return {message};
  return ("case edited")
}

router.put('/:id', async function(req, res, next) {
  try {
    res.json(await update(req.params.id, req.body));
  } catch (error: any) {
    console.error(`Error while updating case`, error.message);
    next(error);
  }
});

async function remove(id: string){
  // const result = await db.query(
  //   `DELETE FROM cases WHERE id=${id}`
  // );

  delete cases[cases.findIndex(item => item.id == id)];

  // let message = 'Error in deleting cases';

  // if (result.affectedRows) {
  //   message = 'Case deleted successfully';
  // }

  //return {message};
  return ("Case deleted")
}

router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await remove(req.params.id));
  } catch (error: any) {
    console.error(`Error while deleting case`, error.message);
    next(error);
  }
});

export default router
