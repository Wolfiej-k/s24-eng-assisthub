from pymongo import MongoClient

client = MongoClient('mongodb://127.0.0.1/assisthub')  # replace with your MongoDB connection string
db = client['assisthub']  # replace with your database name

coaches_collection = db['coaches']
cases_collection = db['cases']

# Retrieve all coaches
coaches = coaches_collection.find()
for coach in coaches:
    print(coach)

# Retrieve all cases
cases = cases_collection.find()
for case in cases:
    print(case)
