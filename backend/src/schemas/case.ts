import Ajv, { type JSONSchemaType } from "ajv"

export interface Client {
  name: string
  email: string
  phone: string
  zip: string
}

export interface Case {
  client: Client
  language: string
  benefits: string
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
      },
      required: ["name", "email", "phone", "zip"],
    },
    language: { type: "string" },
    benefits: { type: "string" },
  },
  required: ["client", "language", "benefits"],
  additionalProperties: false,
}

const ajv = new Ajv()
export const validateCase = ajv.compile(caseSchema)
