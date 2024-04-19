from pymongo import MongoClient
from faker import Faker
import random
from datetime import datetime, timedelta

faker = Faker()

# Connect to MongoDB
client = MongoClient('mongodb://127.0.0.1/assisthub')
db = client.assisthub

# Create coaches
def create_coaches(num_coaches):
    coaches = [{
        'name': faker.name(),
        'email': faker.email(),
        'isAdmin': False
    } for _ in range(num_coaches)]

    db.coaches.insert_many(coaches)
    print(f"{num_coaches} coaches created.")

create_coaches(10)

# Create cases
def create_cases(num_cases):
    cases = [{
        'client': {
            'name': faker.name(),
            'email': faker.email()
        },
        'coaches': [],
        'data': {
            'key1': faker.words(2),
            'key2': faker.words(2)
        },
        'startTime': datetime.now(),
        'endTime': datetime.now() + timedelta(days=1),
        'notes': faker.sentence()
    } for _ in range(num_cases)]

    db.cases.insert_many(cases)
    print(f"{num_cases} cases created.")

create_cases(50)

# Assign cases to coaches
def assign_cases_to_coaches():
    all_coaches = list(db.coaches.find())
    all_cases = list(db.cases.find())

    for case in all_cases:
        num_coaches = random.randint(1, 3)  # Assign 1 to 3 coaches randomly
        selected_coaches = random.sample(all_coaches, num_coaches)
        selected_coach_ids = [coach['_id'] for coach in selected_coaches]

        db.cases.update_one(
            {'_id': case['_id']},
            {'$set': {'coaches': selected_coach_ids}}
        )

    print("Cases have been assigned to coaches randomly.")

assign_cases_to_coaches()
