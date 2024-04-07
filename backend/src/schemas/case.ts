import { model, Schema, type InferSchemaType } from "mongoose"
import { clientSchema } from "./client.js"

const caseSchema = new Schema({
  client: { type: clientSchema, required: true },
  coaches: { type: [{type : Schema.Types.ObjectId, ref: "Coach"}], required: true },
  data: { type: Map, of: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  notes: { type: String },
})

export type Case = InferSchemaType<typeof caseSchema>
export const CaseModel = model("Case", caseSchema)
