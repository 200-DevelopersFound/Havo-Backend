/users/create

- [x] Username, Email, Password not found
- [x] User already found.
- [ ] Email, Password not found
- [ ] Password not found

Request

```
{
    "username" : "shredqwd",
    "email" : "shreyawdqwdqns1313@gmail.com",
    "password" : "aswfwefw123"
}
```

Response

```
{
    "auth": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjdiZDBhYzgzNjNhMjgzN2U0ZTVmMCIsInRva2VuX2lkIjp7InVzZXJJZCI6IjYxYjdiZDBhYzgzNjNhMjgzN2U0ZTVmMCIsImxvZ2dlZE91dCI6ZmFsc2UsImxvZ2dlZEluQXQiOiIyMDIxLTEyLTEzVDIxOjM2OjEyLjYxOFoiLCJsb2dnZWRPdXRBdCI6IjIwMjEtMTItMTNUMjE6MzY6MTIuNjE4WiIsImlwQWRkcmVzcyI6Ijo6MSIsInRva2VuSWQiOiIxMTY2VlZYWjcwNzZPTE9LIiwidG9rZW5TZWNyZXQiOiI0NDg4OTQ3OVlCR0RWUExONDc0OTQ0ODhIVUFOVkFLWCIsInRva2VuRGVsZXRlZCI6ZmFsc2UsImRldmljZSI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS85NS4wLjQ2MzguNTQgU2FmYXJpLzUzNy4zNiIsIl9pZCI6IjYxYjdiZDBjYzgzNjNhMjgzN2U0ZTVmMyIsIl9fdiI6MH0sImlhdCI6MTYzOTQzMTQzNn0.XYWoJbwPFf_CFrsJ5YATkT4ohSyJUDX4PxslAWKGdP8",
    "message": "User found and Logged in"
}
```

/users/login

- [x] Invalid Credentials - email
- [x] Invalid Credentials - password
- [x] Email, Password not found - both
- [ ] Password not found

Request

```
{
    "email" : "shreyawdqwdqns1313@gmail.com",
    "password" : "aswfwefw123"
}
```

Response

```
{
    "auth": true,
    "token": {},
    "message": "User found and Logged in"
}
```
