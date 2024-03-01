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
  id: number // Added an ID for easier manipulation
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

interface UpdateParams {
  resource: Resource // Assuming resource is a string
  id: number // Assuming id is a number
  variables: any // Replace 'any' with a more specific type if possible
  meta: any // Replace 'any' with a more specific type if possible
}

interface GetListParams {
  resource: Resource // Assuming resource is a string
  pagination: any // Replace 'any' with a more specific type if possible
  sorters: any // Replace 'any' with a more specific type if possible
  filters: any // Replace 'any' with a more specific type if possible
  meta: any // Replace 'any' with a more specific type if possible
}

// Using an object to store cases by resource type
type Resource = "cases"
const storage: Record<Resource, Case[]> = {
  cases: [
    {
      id: 1,
      benefit: "CalFresh",
      timestamp: new Date("2024-02-29"),
      contact: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        zip: "02138",
        language: "English",
      },
    },
    {
      id: 2,
      benefit: "Section 8/Housing",
      timestamp: new Date("2005-01-01"),
      contact: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "098-765-4321",
        zip: "01237",
        language: "Spanish",
      },
    },
  ],
}

const dataProvider: DataProvider = {
  getList: ({ resource, pagination, sorters, filters, meta }: { GetListParams }) => {
    const resourceData = storage[resource] ?? []
    // Implement pagination and sorting logic here. For simplicity, returning all data.
    return Promise.resolve({ data: resourceData, total: resourceData.length })
  },
  create: ({ resource, variables, meta }) => {
    if (!storage[resource]) {
      storage[resource] = []
    }
    const newCase = { id: storage[resource].length + 1, ...variables }
    storage[resource].push(newCase)
    return Promise.resolve(newCase)
  },
  update = ({ resource, id, variables, meta }: UpdateParams) => {
    const resourceData = storage[resource]
    if (!resourceData) {
      return Promise.reject(new Error("Resource not found"))
    }
    const index = resourceData.findIndex((c) => c.id === id)
    if (index === -1) {
      return Promise.reject(new Error("Case not found"))
    }
    resourceData[index] = { ...resourceData[index], ...variables }
    return Promise.resolve(resourceData[index])
  },
  deleteOne: ({ resource, id, variables, meta }) => {
    const resourceData = storage[resource]
    if (!resourceData) {
      return Promise.reject(new Error("Resource not found"))
    }
    const index = resourceData.findIndex((c) => c.id === id)
    if (index === -1) {
      return Promise.reject(new Error("Case not found"))
    }
    resourceData.splice(index, 1)
    return Promise.resolve({ id })
  },
  getOne: ({ resource, id, _meta }) => {
    const resourceData = storage[resource]
    if (!resourceData) {
      return Promise.reject(new Error("Resource not found"))
    }
    const caseItem = resourceData.find((c) => c.id === id)
    if (!caseItem) {
      return Promise.reject(new Error("Case not found"))
    }
    return Promise.resolve(caseItem)
  },
  getApiUrl: () => "https://api.fake-rest.refine.dev",
}

export default dataProvider
