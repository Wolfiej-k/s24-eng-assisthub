import { model, Schema, type InferSchemaType } from "mongoose"
import { customAlphabet } from "nanoid"
import { clientSchema } from "./client"

const nanoid = customAlphabet("1234567890abcdef", 16)

const fileSchema = new Schema(
  {
    name: { type: String, required: true },
    data: { type: String, required: true },
  },
  { _id: false },
)

const caseSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  client: { type: clientSchema, required: true },
  coaches: { type: [{ type: Schema.Types.ObjectId, ref: "Coach" }], default: [] },
  benefits: { type: [{ type: String }], default: [] },
  data: { type: Map, of: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  notes: { type: String, default: "" },
  files: { type: [fileSchema], default: [] },
})

caseSchema.pre("save", function (next) {
  this.coaches = [...new Set(this.coaches)]
  this.benefits = [...new Set(this.benefits)]
  next()
})

export type Case = InferSchemaType<typeof caseSchema>
export const CaseModel = model("Case", caseSchema)
