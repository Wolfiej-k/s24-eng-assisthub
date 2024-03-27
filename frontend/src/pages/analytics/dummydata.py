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

def create_case(name: str, coach : str):
  random_month = random.randint(1, 12)
  current_year = datetime.now().year
  random_month_date = datetime(current_year, random_month, 1)
  random_additional_month = random.randint(1, 10)
  has_end_date = True if random_month + random_additional_month <= 12 else False
  end_time = random_month_date + random_additional_month * timedelta(days=30)
  end_time = end_time.isoformat() if has_end_date else None
  req = {
        "client": {
            "name": name,
            "email": ".".join(name.lower().split(" ")) + "@example.com",
            "phone": "283-334-2303",
            "zip":  "90003",
            "profile": "profile.com/" + "".join(name.lower())
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


# def create_coach(name: str):
#     req = {
#         "id": str(random.randint(0, 100000)),
#         "name": name,
#         "email": ".".join(name.lower().split(" ")) + "@example.com"
#     }
#     response = requests.post("http://localhost:3000/api/coaches/", json=req)
#     if response.status_code in [200, 201]:
#       print(f"Successfully created client: {name}")
#     else:
#       print(f"Failed to create client: {name}. Status code: {response.status_code}, Response: {response.text}")
# def create_client(name: str):
#     req = {
#         "name": name,
#         "email": ".".join(name.lower().split(" ")) + "@example.com",
#         "phone": "283-334-2303",
#         "zip": str(random.choice(list(zip_codes.keys()))),
#         "profile": "profile.com/" + "".join(name.lower())
#     }
#     response = requests.post("http://localhost:3000/api/clients/", json=req)
#     if response.status_code in [200, 201]:
#       print(f"Successfully created client: {name}")
#     else:
#       print(f"Failed to create client: {name}. Status code: {response.status_code}, Response: {response.text}")

fake = Faker()
client_names = []
coach_names = []
for _ in range(1):
    create_case(fake.name(), fake.name())
#creates fake clients
# for _ in range(10):
#     coach_name = str(fake.name())
#     create_coach(coach_name)
#     coach_names.append(coach_name)

#     client_name = fake.name()
#     create_client(client_name)
#     client_names.append(client_name)
# # creates fake cases
# for client_name in client_names:
#     coach_name = random.choice(coach_names)
#     create_case(client_name, coach_name)


