export interface Client {
  name: string
  email: string
  phone: string
  zip: string
  profile: string
}

export interface Coach {
  _id: string
  name: string
  email: string
  admin: boolean
}

interface File {
  data: string
  name: string
}

export interface Case {
  _id: string
  client: Client
  coaches: Coach[]
  benefits: string[]
  data: Record<string, string>
  startTime: Date
  endTime?: Date
  notes: string
  files: File[]
}
