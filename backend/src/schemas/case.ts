//import Ajv, { type JSONSchemaType } from "ajv"
import mongoose, { Schema} from 'mongoose';

interface Client {
  name: string
  email: string
  phone: string
  zip: string
  profile: string
}

interface Coach {
  name: string
  email: string
}

interface Case {
  client: Client
  coaches: Coach[]
  data: Record<string, string>
  notes?: string
}

export interface CaseItem extends Case {
  id: number
  startTime: Date
  endTime?: Date
}

const caseSchema = new Schema<Case>({
  client: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      zip: { type: String, required: true },
      profile: { type: String, required: true }
  },
  coaches: [{
      name: { type: String, required: true },
      email: { type: String, required: true }
  }],
  data: { type: {}, required: true },
  notes: { type: String }
});

//const ajv = new Ajv()
//export const validateCase = ajv.compile(caseSchema)
export const CaseModel = mongoose.model("Case", caseSchema)
