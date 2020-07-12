# api-for-interview

## API EndPoint 1:
#### Request Type:
POST
#### Request URL:
http://api-for-interview.herokuapp.com/api/user/
#### Request Body: 
```
{
    "firstName": "Radhika",
    "lastName": "Patel",
    "username": "radhikaPatel",
    "password": "radhikaPatel"
}
```
#### Response:
```
{
    "message": "User radhikaPatel created successfully.",
    "data": {
        "firstName": "Radhika",
        "lastName": "Patel",
        "username": "radhikaPatel"
    }
}
```

## API EndPoint 2:
#### Request Type:
POST
#### Request URL:
http://api-for-interview.herokuapp.com/api/user/login
#### Request Body: 
```
{
    "username": "radhikaPatel",
    "password": "radhikaPatel"
}
```
#### Response:
```
{
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhZGhpa2FwYXRlbCIsImlhdCI6MTU5NDUzMDQzOCwiZXhwIjoxNTk0NTM0MDM4fQ.J-I6BpeRilPQgoaO6m1JXJs5cpMOYTCPeWGQ0sXkVCo"
}
```

## API EndPoint 3:
#### Request Type:
POST
#### Request URL:
http://api-for-interview.herokuapp.com/api/services/agent-client
#### Request Header:
Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhZGhpa2FwYXRlbCIsImlhdCI6MTU5NDUzMDQzOCwiZXhwIjoxNTk0NTM0MDM4fQ.J-I6BpeRilPQgoaO6m1JXJs5cpMOYTCPeWGQ0sXkVCo"
#### Request Body:
```
{
    "agent": {
        "name": "Agent 3",
        "address1": "Agent address line 1",
        "state": "Maharashtra",
        "city": "Mumbai",
        "phoneNumber": 5678901234
    },
    "client": {
        "name": "XYZ Consultancy Ltd.",
        "email": "abc@xyz.com",
        "phoneNumber": 9876543210,
        "totalBill": 50000
    }
}
```
#### Response:
```
{
    "message": "Agent and Client created successfully.",
    "data": {
        "agent": {
            "name": "Agent 3"
        },
        "client": {
            "name": "XYZ Consultancy Ltd.",
            "agent": "Agent 3"
        }
    }
}
```

## API EndPoint 4:
#### Request Type:
PUT
#### Request URL:
http://api-for-interview.herokuapp.com/api/services/client
#### Request Header:
Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhZGhpa2FwYXRlbCIsImlhdCI6MTU5NDUzMDQzOCwiZXhwIjoxNTk0NTM0MDM4fQ.J-I6BpeRilPQgoaO6m1JXJs5cpMOYTCPeWGQ0sXkVCo"
#### Request Body:
```
{
    "name": "XYZ Consultancy Ltd.",
    "email": "abc@xyz.com",
    "phoneNumber": 9876543210,
    "totalBill": 40000
}
```
#### Response:
```
{
    "message": "Client updated successfully.",
    "data": {
        "name": "XYZ Consultancy Ltd.",
        "email": "abc@xyz.com",
        "phoneNumber": 9876543210,
        "totalBill": 40000,
        "updatedAt": "2020-07-12T05:07:50.682Z"
    }
}
```

## API EndPoint 5:
#### Request Type:
GET
#### Request URL:
http://api-for-interview.herokuapp.com/api/services/maxbill
#### Request Header:
```
Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhZGhpa2FwYXRlbCIsImlhdCI6MTU5NDUzMDQzOCwiZXhwIjoxNTk0NTM0MDM4fQ.J-I6BpeRilPQgoaO6m1JXJs5cpMOYTCPeWGQ0sXkVCo"
```
#### Response:
```
{
    "message": "Max Bill Clients",
    "data": [
        {
            "AgentName": "Agent 1",
            "ClientName": "Client 1",
            "TotalBill": 40000
        },
        {
            "AgentName": "Agent 2",
            "ClientName": "Client 4",
            "TotalBill": 40000
        },
        {
            "AgentName": "Agent 3",
            "ClientName": "XYZ Consultancy Ltd.",
            "TotalBill": 40000
        }
    ]
}
```
