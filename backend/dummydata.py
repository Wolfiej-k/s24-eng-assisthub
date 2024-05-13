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
# with open('zipcodes.json', 'r') as file:
#   zip_codes = json.load(file)

def rand_zip():
  opts = ["94544", "90063", "90262", "94591", "91770", "93230", "91702", "92708", "94587", "90703", "90019", "90034", "93722", "92144", "91331"]
  return random.choice(opts)

def rand_phone():
  first = str(random.randint(100,999))
  second = str(random.randint(1,888)).zfill(3)

  last = (str(random.randint(1,9998)).zfill(4))
  while last in ['1111','2222','3333','4444','5555','6666','7777','8888']:
      last = (str(random.randint(1,9998)).zfill(4))
      
  return '{}-{}-{}'.format(first,second, last)

def create_case(name: str):
  random_month = random.randint(1, 12)
  current_year = datetime.now().year - 1
  random_month_date = datetime(current_year, random_month, 1)
  random_additional_month = random.randint(1, 10)
  has_end_date = True if random_month + random_additional_month <= 12 else False
  end_time = random_month_date + random_additional_month * timedelta(days=30)
  end_time = end_time.isoformat() if has_end_date else None
  req = {
        "client": {
            "name": name,
            "email": ".".join(name.lower().split(" ")) + "@gmail.com",
            "phone": rand_phone(),
            "zip":  rand_zip(),
            "profile": "https://assisthub.com/" + "".join(name.lower().split(" "))
        },
        "data": {},
        "startTime": random_month_date.isoformat(),
        "endTime":  end_time,
        "notes": ""
    }
  response = requests.post("http://localhost:3000/api/cases/", json=req, headers={ "secret": "thiswillbechanged" })
  if response.status_code in [200, 201]:
    print(f"Successfully created client: {name}")
  else:
    print(f"Failed to create client: {name}. Status code: {response.status_code}, Response: {response.text}")

fake = Faker()
for _ in range(60):
  create_case(fake.name())