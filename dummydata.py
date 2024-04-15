import requests
from faker import Faker
import random
import json
from datetime import datetime, timedelta

'''
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

'''

def create_case(name: str):
  req = {
        "client": {
            "name": name,
            "email": ".".join(name.lower().split(" ")) + "@example.com",
            "phone": "283-334-2303",
            "zip":  "90003",
            "profile": "profile.com/" + "".join(name.lower().split(" "))
        },
        "data": {},
        "startTime": random_month_date.isoformat(),
        "endTime":  end_time,
        "notes": "This is a test case"
    }
  response = requests.post("http://localhost:3000/api/cases/", json=req)
  if response.status_code in [200, 201]:
    print(f"Successfully created client: {name}")
  else:
    print(f"Failed to create client: {name}. Status code: {response.status_code}, Response: {response.text}")

def create_coach(name: str):
  req = {
    "name": name,
    "email": ".".join(name.lower().split(" ")) + "@example.com"
  }
  response = requests.post("http://localhost:3000/api/coaches/", json=req)
  if response.status_code in [200, 201]:
    print(f"Successfully created coach: {name}")
  else:
    print(f"Failed to create coach: {name}. Status code: {response.status_code}, Response: {response.text}")


fake = Faker()
client_names = []
coach_names = []
for _ in range(5):
  create_coach(fake.name())