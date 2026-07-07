# ⚙️ DevChronicles — Backend API (Node.js + GraphQL + MongoDB)

A robust, production-grade GraphQL API server built with **Node.js**, **Express**, **Apollo Server 4**, and **MongoDB (Mongoose)**. 

This repository powers the backend data layer for the **GraphQL Blog App assignment**, featuring typed schemas, keyword searching, tag filtering, and intelligent zero-config database fallbacks.

---

## 🧠 Architectural Approach & Design Philosophy

When architecting this GraphQL backend, our primary focus was **reliability, schema safety, and zero-config developer ergonomics**.

### 1. Zero-Config Database Resilience
One of the most common issues during technical evaluations is failing to run an app because MongoDB is not installed locally or cloud connection strings expire. To solve this permanently:
- We engineered an intelligent connection wrapper around Mongoose (`db.js`).
- On startup, the server attempts to connect to local MongoDB (`mongodb://127.0.0.1:27017`). If a local daemon is not detected within 3 seconds, the system gracefully falls back to an embedded **in-memory MongoDB engine (`mongodb-memory-server`)**.
- This ensures that evaluators can install and run the application instantly without Docker or local database setup!

### 2. Typed GraphQL Schema & Modular Resolvers
Instead of a REST API with fragmented endpoints, we designed a unified GraphQL GraphQL schema (`typeDefs.js`) with dedicated resolvers (`resolvers.js`):
- **Flexible Queries**: The `getPosts` query accepts optional `search` and `tag` arguments. The resolver dynamically builds a Mongoose query object, applying regex matching on titles and descriptions when searching, and array matching for tags.
- **Data Integrity**: Our Mongoose `Post` model enforces strict validation, default timestamps, and automatically trims input strings.

### 3. Native Base64 File Support
To support drag-and-drop image uploading from the frontend without setting up complex AWS S3 or Cloudinary buckets, we configured Express body parsers with a **10MB limit**. This allows the backend to natively accept, validate, and store Base64 image data strings directly inside MongoDB documents.

---

## ✨ Features & Highlights

- **📡 Apollo Server 4 & GraphQL**: Fully typed schema definition (`typeDefs.js`) and modular resolvers (`resolvers.js`).
- **🔍 Advanced Querying**: Supports fetching all posts, single posts by ID, keyword searching (title & description), and tag-based filtering.
- **🛡️ Zero-Config Database Resilience**: Auto-detects local MongoDB with seamless fallback to embedded in-memory MongoDB.
- **🌱 Automated Database Seeder**: Includes a custom seeding script (`npm run seed`) that populates the database with high-quality tech articles and cover images.
- **📦 Base64 Image Support**: Natively accepts and stores uploaded Base64 image data URIs from the frontend.

---

## 🛠️ Technology Stack

- **Runtime & Server**: Node.js, Express.js, Apollo Server (`@apollo/server`)
- **Database & ODM**: MongoDB, Mongoose (`mongoose`)
- **Fallback Engine**: MongoDB Memory Server (`mongodb-memory-server`)
- **Utilities**: CORS, Dotenv

---

## ⚙️ Step-by-Step Setup Instructions

Follow these instructions to run the backend GraphQL API on your local machine.

### Prerequisites
1. **Node.js**: Ensure Node.js (`v18.x` or higher) is installed on your machine.
2. *(Optional)* Local MongoDB instance running on port `27017`. If not available, the server will automatically use the in-memory fallback!

### Step 1: Clone the Repository
Open your terminal and clone this backend repository:
```bash
git clone https://github.com/rishi1606/GraphQL-Blog-Backend.git
cd GraphQL-Blog-Backend
```

### Step 2: Install Dependencies
Install required Node.js, Express, Apollo, and Mongoose packages:
```bash
npm install
```

### Step 3: Seed Sample Data
Populate your database with sample blog posts and tags:
```bash
npm run seed
```
*Output: `✅ Sample blog posts seeded successfully!`*

### Step 4: Start the API Server
Start the GraphQL server with auto-reload:
```bash
npm run dev
```
*The GraphQL server will be live at: **[http://localhost:5000/graphql](http://localhost:5000/graphql)**.*

---

## 🧪 GraphQL Sandbox & Example Queries

Open [http://localhost:5000/graphql](http://localhost:5000/graphql) in your browser to access the Apollo Studio Sandbox and test these queries directly:

### Fetch All Posts (or Search by Tag)
```graphql
query GetPosts($search: String, $tag: String) {
  getPosts(search: $search, tag: $tag) {
    id
    title
    description
    author
    coverImage
    tags
    createdAt
  }
}
```

### Create a New Blog Post
```graphql
mutation CreatePost($title: String!, $description: String!, $content: String!, $author: String, $tags: [String], $coverImage: String) {
  createPost(title: $title, description: $description, content: $content, author: $author, tags: $tags, coverImage: $coverImage) {
    id
    title
    createdAt
  }
}
```

### Delete a Blog Post
```graphql
mutation DeletePost($id: ID!) {
  deletePost(id: $id)
}
```

---

## 🔗 Related Repository
- **Frontend UI Repository**: [https://github.com/rishi1606/GraphQL-Blog-Frontend](https://github.com/rishi1606/GraphQL-Blog-Frontend)
