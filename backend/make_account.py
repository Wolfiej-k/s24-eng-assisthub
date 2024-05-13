import requests
req = {
  "name":"Alice Liu",
  "email":"austinhhliu@gmail.com",
  "admin": True
}
requests.post("http://localhost:3000/api/coaches/", json=req, headers={ "secret": "thiswillbechanged" })
