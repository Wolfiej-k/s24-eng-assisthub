type Status = "open" | "closed"

export interface Client {
  name: string
  email: string
  phone: number
  zip: number
}

export interface Case {
  client: Client
  status: Status
  startTime: Date
  endTime?: Date
  language: string
  benefits: string
}

export interface CaseItem extends Case {
  id: number
}
