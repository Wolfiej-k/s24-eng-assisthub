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
with open('zipcodes.json', 'r') as file:
    zip_codes = json.load(file)

def create_case(name: str):
  random_month = random.randint(1, 12)
  current_year = datetime.now().year - 1
  random_month_date = datetime(current_year, random_month, 1)
  random_additional_month = random.randint(1, 10)
  has_end_date = True if random_month + random_additional_month <= 12 else False
  end_time = random_month_date + random_additional_month * timedelta(days=30)
  end_time = end_time.isoformat() if has_end_date else None
  response = requests.get("http://localhost:3000/api/coaches/662aacc9fbec8022fe82f193", headers={'id': '662aacc9fbec8022fe82f193', 'Secret': 'thiswillbechanged'})
  coach = response.json()
  print(coach)
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
    "notes": "This is a test case",
    "coaches": [coach]
    }
  print(req)
  response = requests.post("http://localhost:3000/api/cases/", json=req, headers={'Secret': 'thiswillbechanged'})
  if response.status_code in [200, 201]:
    print(f"Successfully created client: {name}")
  else:
    print(f"Failed to create client: {name}. Status code: {response.status_code}, Response: {response.text}")

fake = Faker()
client_names = []
coach_names = []
for _ in range(60):
  create_case(fake.name())

# req = {
#     "name": "julia",
#     "email": "jjpoulson@college.harvard.edu"
#     }
# response = requests.post("http://localhost:3000/api/coaches/", json=req, headers={'Secret': 'thiswillbechanged'})
# if response.status_code in [200, 201]:
#   print(f"Successfully created coach: julia")
# else:
#   print(f"Failed to create coach: julia. Status code: {response.status_code}, Response: {response.text}")


# response = requests.get("http://localhost:3000/api/coaches/", headers={'Secret': 'thiswillbechanged'})

# cases = response.json()
# print(cases)

# for case in cases:
#   print(case["_id"])
  #response = requests.delete("http://localhost:3000/api/coaches/" + case["_id"], headers={'id': case["_id"], 'Secret': 'thiswillbechanged'})

#   if response.status_code == 204:
#       print("Successfully deleted.")
#   else:
#       print(f"Failed to delete. Status code: {response.status_code}, Response: {response.text}")