import requests
def create_case(name: str):
    req = {
        "client": {
            "name": name,
            "email": ".".join(name.lower().split(" ")) + "@example.com",
            "phone": "283-334-2303",
            "zip": "11392",
            "profile": "profile.com/" + "".join(name.lower())
        },
        "data": {}
    }
    requests.post("http://localhost:3000/api/cases/", json=req)
create_case("Mary Jane")
