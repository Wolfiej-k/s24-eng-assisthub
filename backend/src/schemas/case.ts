import { model, Schema, type InferSchemaType } from "mongoose"
import { clientSchema } from "./client"

const documentSchema = new Schema({
  data: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false }); // this is to keep the name of the documents when uploaded

const caseSchema = new Schema({
  client: { type: clientSchema, required: true },
  coaches: { type: [{ type: Schema.Types.ObjectId, ref: "Coach" }], required: true },
  data: { type: Map, of: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  notes: { type: String },
  documents: { type: [documentSchema], required: true },
})

export type Case = InferSchemaType<typeof caseSchema>
export const CaseModel = model("Case", caseSchema)
