import { type DataProvider } from "@refinedev/core"

type Benefit =
  | "CalFresh"
  | "Section 8/Housing"
  | "Student Debt"
  | "Rent Support"
  | "Utilities relief"
  | "Childcare"
  | "Tax Credits"
  | "Legal Aid"

interface Case {
  benefit: Benefit
  timestamp: Date
  contact: {
    name: string
    email: string
    phone: string
    zip: string
    language: string
  }
}

const cases: Case[] = []

const dataProvider: DataProvider = {
  // required methods
  getList: ({ resource, pagination, sorters, filters, meta }) => {
    return cases
  },
  create: ({ resource, variables, meta }) => {
    cases.push(variables)
  },
  update: ({ resource, id, variables, meta }) => {
    cases[id] = variables
  },
  deleteOne: ({ resource, id, variables, meta }) => {
    cases.pop[id]
  },
  getOne: ({ resource, id, meta }) => {
    return cases[id]
  },
  getApiUrl: () => "https://api.fake-rest.refine.dev",
}

// Type of benefit and/or support requested (such as CalFresh, Section 8/Housing, Student Debt, Rent Support, Utilities relief, childcare, tax credits, legal aid)
// ○ Timestamp of when case is created; timestamp of when a case is “completed/closed”
// ○ Contact information (Name, email, phone, zip code, preferred language)
// ○ Responses to AssistHub’s initial intake form (currently being transitioned from Typeform to AWS)
