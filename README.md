# 📱 Social App

A **modular social media backend** built with Node.js, featuring REST APIs, GraphQL support, and real-time chat via Socket.IO. The project is organized into three independent modules, each focused on a distinct layer of functionality.

---

## 🧩 Project Structure

```
Social_App/
├── src/              # Core REST API (users, posts, comments, auth)
├── GraphQLApp/       # GraphQL API layer
├── sockeio/          # Real-time chat with Socket.IO
├── index.js          # Application entry point
└── .gitignore
```

---

## ✨ Features

- 🔐 **Authentication** — Register, login, and secure routes with JWT
- 👤 **User Management** — CRUD operations on user profiles
- 📝 **Posts & Comments** — Create, read, update, and delete posts and comments
- 💬 **Real-Time Chat** — Bi-directional messaging powered by Socket.IO
- 🔗 **GraphQL API** — Flexible data querying via a dedicated GraphQL module
- 🌐 **REST APIs** — Clean, structured RESTful endpoints

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Real-Time | Socket.IO |
| API Style | REST + GraphQL |
| Language | JavaScript (ES6+) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/atlas))
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Bavly2005/Social_App.git
cd Social_App

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values (see Environment Variables section)

# 4. Start the server
node index.js
```

For development with auto-restart:

```bash
npm run dev
# or
npx nodemon index.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following keys:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/social_app
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

---

## 📡 API Overview

### REST Endpoints (`src/`)

#### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT |

#### Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get user by ID |
| `PUT` | `/api/users/:id` | Update user profile |
| `DELETE` | `/api/users/:id` | Delete a user |

#### Posts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts` | Get all posts |
| `POST` | `/api/posts` | Create a new post |
| `GET` | `/api/posts/:id` | Get post by ID |
| `PUT` | `/api/posts/:id` | Update a post |
| `DELETE` | `/api/posts/:id` | Delete a post |

#### Comments

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/posts/:id/comments` | Add a comment to a post |
| `DELETE` | `/api/posts/:id/comments/:commentId` | Delete a comment |

> 🔒 Protected routes require an `Authorization: Bearer <token>` header.

---

### GraphQL API (`GraphQLApp/`)

The GraphQL module provides a flexible query interface as an alternative to the REST layer.

**Endpoint:** `POST /graphql`

**Example query:**

```graphql
query {
  users {
    id
    username
    email
  }
}
```

**Example mutation:**

```graphql
mutation {
  createPost(title: "Hello World", body: "My first post") {
    id
    title
    createdAt
  }
}
```

---

### Real-Time Chat (`sockeio/`)

The Socket.IO module handles real-time, bi-directional messaging.

**Key events:**

| Event | Direction | Description |
|---|---|---|
| `connection` | Server ← Client | Client connects |
| `sendMessage` | Server ← Client | Client sends a message |
| `receiveMessage` | Server → Client | Server broadcasts a message |
| `disconnect` | Server ← Client | Client disconnects |

**Client-side example:**

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.emit("sendMessage", { room: "general", text: "Hello!" });

socket.on("receiveMessage", (msg) => {
  console.log(msg);
});
```

---

## 🗂️ Module Details

### `src/` — REST API Core

The main backend module. Contains routes, controllers, models, and middleware for the full social media feature set.

```
src/
├── models/       # Mongoose schemas (User, Post, Comment)
├── routes/       # Express route definitions
├── controllers/  # Business logic
└── middleware/   # Auth & error handling middleware
```

### `GraphQLApp/` — GraphQL Module

A standalone GraphQL server that mirrors the REST API functionality with a schema-based querying interface.

### `sockeio/` — Socket.IO Chat Module

Real-time chat server supporting room-based messaging and live event broadcasting.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Bavly** — [@Bavly2005](https://github.com/Bavly2005)

---

## 📄 License

This project is open-source. See the repository for details.
