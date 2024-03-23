import Ajv, { type JSONSchemaType } from "ajv"

export interface Client {
  name: string
  email: string
  phone: string
  zip: string
  profile: string
}

export interface Coach {
  name: string
  email: string
}

export interface Case {
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

const caseSchema: JSONSchemaType<Case> = {
  type: "object",
  properties: {
    client: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        zip: { type: "string" },
        profile: { type: "string" },
      },
      required: ["name", "email", "phone", "zip", "profile"],
    },
    coaches: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
        },
        required: ["name", "email"],
      },
    },
    data: {
      type: "object",
      required: [],
    },
    notes: { type: "string", nullable: true },
  },
  required: ["client", "coaches", "data"],
}

const ajv = new Ajv()
export const validateCase = ajv.compile(caseSchema)
