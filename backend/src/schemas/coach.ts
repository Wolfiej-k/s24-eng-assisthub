import { model, Schema, type InferSchemaType } from "mongoose"

export const coachSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  isAdmin: { type: Boolean },
})

export type Coach = InferSchemaType<typeof coachSchema>
export const CoachModel = model("Coach", coachSchema)
