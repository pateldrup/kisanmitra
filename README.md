
# 🌾 Kisanmitra – Farmer Help & Support Platform

AgriConnect is a **Full Stack Web Application** designed to help farmers get support for farming-related problems.
Farmers can post their issues, get solutions from other farmers or experts, and access useful agricultural information.

This platform aims to **digitally connect farmers, share knowledge, and solve real-world agricultural problems.**

---

# 🚀 Features

### 🔐 Authentication

* User Signup
* User Login
* Password validation
* Protected routes
* LocalStorage based authentication

### 📝 Farmer Problem Posting

Farmers can share their farming problems such as:

* Crop diseases
* Soil issues
* Irrigation problems
* Pest attacks

Users can:

* Create posts
* Read posts
* Update posts
* Delete posts

<img width="1879" height="895" alt="image" src="https://github.com/user-attachments/assets/efb06b46-ea41-42f0-b835-540ccb8e2020" />


### 🔍 Search, Filter & Sort

* Search problems by crop name or title
* Filter by problem category
* Sort by latest posts

### 📄 Pagination

Large datasets are handled with pagination using:

* MongoDB `limit`
* MongoDB `skip`

### 🌙 Theme Support

* Light Mode
* Dark Mode
* Theme preference saved in LocalStorage

### ⚡ Debouncing

Search input uses debouncing to reduce unnecessary API calls.

### 📱 Responsive UI

Built using **Tailwind CSS** to support:

* Desktop
* Tablet
* Mobile devices

### ⚠ Error Handling

* Backend API error responses
* Frontend error messages
* Try–catch blocks for API requests

---

# 🛠 Tech Stack

## Frontend

* React.js
* Tailwind CSS
* React Router
* Context API

## Backend

* Node.js
* Express.js

## Database

* MongoDB

---

# 🧠 React Hooks Used

* `useState` – Manage component state
* `useEffect` – Handle API calls
* `useRef` – DOM access and search focus
* `useContext` – Global state management

---

# 📂 Project Structure

## Frontend

```
client/
│
├── src/
│   ├── components
│   ├── pages
│   ├── context
│   ├── hooks
│   ├── services
│   ├── utils
│   └── App.jsx
```

## Backend

```
server/
│
├── controllers
├── models
├── routes
├── middleware
├── config
└── server.js
```

---

# 📊 Database Schema

## Users Collection

```
{
  name: String,
  email: String,
  password: String,
  location: String,
  createdAt: Date
}
```

## Problems Collection

```
{
  title: String,
  description: String,
  cropType: String,
  image: String,
  createdBy: ObjectId,
  createdAt: Date
}
```

## Solutions Collection

```
{
  solutionText: String,
  problemId: ObjectId,
  postedBy: ObjectId,
  createdAt: Date
}
```

---

# 🔗 API Routes

## Authentication

```
POST /api/auth/signup
POST /api/auth/login
```

## Problems

```
GET /api/problems
GET /api/problems/:id
POST /api/problems
PUT /api/problems/:id
DELETE /api/problems/:id
```

## Solutions

```
POST /api/solutions
GET /api/solutions/:problemId
```

---

# ⚙ Installation

## 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/agriconnect.git
```

## 2️⃣ Install Dependencies

### Backend

```
cd server
npm install
```

### Frontend

```
cd client
npm install
```

## 3️⃣ Run Project

### Backend

```
npm start
```

### Frontend

```
npm run dev
```

---

# 🌍 Future Improvements

* Weather API integration
* Mandi price updates
* Image upload for crop diseases
* Farmer community discussion forum
* Expert consultation system

---


Developed by **Drup Patel**

Full Stack Hackathon Project 🚀
