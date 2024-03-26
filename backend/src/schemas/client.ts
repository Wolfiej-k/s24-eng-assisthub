import { model, Schema, type InferSchemaType } from "mongoose"

export const clientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  zip: { type: String, required: true },
  profile: { type: String, required: true },
})

export type Client = InferSchemaType<typeof clientSchema>
export const ClientModel = model("Client", clientSchema)
