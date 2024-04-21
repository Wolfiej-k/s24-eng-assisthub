export interface Client {
  name: string
  email: string
  phone: string
  zip: string
  profile: string
}

export interface Coach {
  _id?: string
  name: string
  email: string
  admin: boolean
}

export interface Case {
  _id: string
  client: Client
  coaches: Coach[]
  data: Record<string, string>
  startTime: Date
  endTime?: Date
  notes?: string
}
