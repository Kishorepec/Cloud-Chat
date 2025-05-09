📄 README.md
markdown
Copy
Edit
# 💬 Real-Time WebSocket Chat App (AWS Lambda + DynamoDB)

This is a simple real-time WebSocket-based chat application built using **AWS Lambda**, **API Gateway (WebSocket)**, and **Amazon DynamoDB**. The frontend is a single-page HTML/JS app. Connections are stored in DynamoDB and messages are broadcasted to all active users.

---

## 🧱 Architecture Overview

- **Frontend**: HTML + JavaScript (WebSocket API)
- **Backend**:
  - **AWS API Gateway (WebSocket)** for managing connections
  - **AWS Lambda (Node.js)** for `$connect`, `$disconnect`, and custom `sendmessage` routes
  - **DynamoDB** to store and manage active connection IDs

---

## 📁 Project Structure

websocket-chat-app/
├── connect.js # Lambda: store new connection ID
├── disconnect.js # Lambda: remove connection ID
├── sendmessage.js # Lambda: broadcast message to all
├── index.html # WebSocket client
├── README.md # Project documentation
└── package.json (opt) # Optional Node config

markdown
Copy
Edit

---

## 🧪 Features

- Stores and removes connection IDs in DynamoDB
- Sends and receives messages in real time
- Clean web-based chat UI using WebSocket API

---

## 🚀 Deployment Guide

### 1. DynamoDB Setup

- Create a table called **`WebSocketConnections`**
- Primary key: `connectionId` (String)

### 2. Lambda Setup

Create **three** Lambda functions with these files:
- `$connect` → `connect.js`
- `$disconnect` → `disconnect.js`
- `sendmessage` → `sendmessage.js`

Ensure each Lambda has the following:
- **Execution role** with:
  - `AmazonDynamoDBFullAccess`
  - `AWSLambdaBasicExecutionRole`

### 3. API Gateway (WebSocket)

- Create a new **WebSocket API**
- Add these routes:
  - `$connect` → `connect` Lambda
  - `$disconnect` → `disconnect` Lambda
  - `sendmessage` → `sendmessage` Lambda
- Deploy to a stage (e.g., `production`)
- Copy the WebSocket URL for frontend use

---

## 💻 Frontend (index.html)

- Open `index.html` in any browser
- Update the WebSocket URL:

```js
const url = "wss://your-api-id.execute-api.region.amazonaws.com/production";
Click Connect, send messages, and chat!

🛡 IAM Roles & Permissions
Ensure the Lambda role has:

json
Copy
Edit
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:PutItem",
    "dynamodb:DeleteItem",
    "dynamodb:Scan"
  ],
  "Resource": "arn:aws:dynamodb:*:*:table/WebSocketConnections"
}
And also:

json
Copy
Edit
{
  "Effect": "Allow",
  "Action": "execute-api:ManageConnections",
  "Resource": "arn:aws:execute-api:*:*:*/*/*/@connections/*"
}
