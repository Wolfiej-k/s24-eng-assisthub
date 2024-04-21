import { model, Schema, type InferSchemaType, type Types } from "mongoose"

export const coachSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  admin: { type: Boolean, required: true },
})

export type Coach = InferSchemaType<typeof coachSchema>
export type CoachRes = Coach & { _id: Types.ObjectId }
export const CoachModel = model("Coach", coachSchema)
