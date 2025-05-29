# 🧠 MongoDB Sharded Cluster Simulation (DBD381 Project)

This project simulates a fully distributed NoSQL database system using **MongoDB replica sets and sharding**, all locally on one machine. It includes scripts to run config servers, regional shards (EU, Asia, US), a `mongos` router, and a sample Express + Mongoose app that routes and inserts data based on region.

---

## 🚀 Prerequisites

### ✅ Required Tools

- **MongoDB Community Edition**
  - Includes `mongod`, `mongos`, and `mongosh`
- **Node.js + npm**

> MongoDB Download: <https://www.mongodb.com/try/download/community>  
> During installation, ensure:
>
> - ✅ Add MongoDB binaries to PATH  
> - ✅ Install `mongosh` if not bundled

---

## 📁 Project Structure

```raw
project-root/
├── mongo-cluster/
│   ├── cfg1/, cfg2/, cfg3/       # Config server data folders (cfg1 is primary)
│   ├── rs_eu1/, rs_eu2/          # EU shard replica set
│   ├── rs_asia1/, rs_asia2/      # Asia shard replica set
│   └── rs_us1/, rs_us2/          # US shard replica set
├── scripts/
│   ├── start-cluster.bat         # Starts all MongoDB nodes
│   └── individual start-*.bat    # Start each node manually if needed
├── routes/                       # Express routers for users, products, orders
├── models/                       # Mongoose schemas with validation and region support
├── app.js                        # Main Express server
├── package.json                  # Node.js dependencies
└── README.md                     # This file
````

`.gitkeep` is used to track empty folders. MongoDB data files (`.wt`, `.turtle`, etc.) are excluded via `.gitignore`.

---

## ⚙️ Setup Steps

### 🔋 1. Start the MongoDB Cluster

Run:

```ps
scripts/start-cluster.bat
```

This starts:

- `cfg_rs` config server (1 node)
- 3 replica sets (EU, Asia, US) with 2 nodes each
- `mongos` router on port `30000`

> Each node opens in a new terminal window. Keep them open.

### 🧠 2. Initialize Config Server Replica Set

Connect:

```bash
mongosh --port 26001
```

Then run:

```js
rs.initiate({
  _id: "cfg_rs",
  configsvr: true,
  members: [
    { _id: 0, host: "localhost:26001" }
  ]
})
```

### 🧱 3. Initialize Each Shard Replica Set

#### EU

```bash
mongosh --port 27001
```

```js
rs.initiate({
  _id: "rs_eu",
  members: [
    { _id: 0, host: "localhost:27001" },
    { _id: 1, host: "localhost:27002" }
  ]
})
```

#### Asia

```bash
mongosh --port 27101
```

```js
rs.initiate({
  _id: "rs_asia",
  members: [
    { _id: 0, host: "localhost:27101" },
    { _id: 1, host: "localhost:27102" }
  ]
})
```

#### US

```bash
mongosh --port 27201
```

```js
rs.initiate({
  _id: "rs_us",
  members: [
    { _id: 0, host: "localhost:27201" },
    { _id: 1, host: "localhost:27202" }
  ]
})
```

### 🌍 4. Add Shards to the Cluster

Connect to router:

```bash
mongosh --port 30000
```

Run:

```js
sh.addShard("rs_eu/localhost:27001,localhost:27002")
sh.addShard("rs_asia/localhost:27101,localhost:27102")
sh.addShard("rs_us/localhost:27201,localhost:27202")
```

### 🗃️ 5. Enable Sharding on `ecommerce` Database

Enable sharding on the database:

```js
sh.enableSharding("ecommerce")
```

Switch to the database:

```js
use ecommerce
```

Create shard key indexes on each collection:

```js
db.users.createIndex({ region: 1 })
db.products.createIndex({ region: 1 })
db.orders.createIndex({ region: 1 })
```

Now shard the collections:

```js
sh.shardCollection("ecommerce.users", { region: 1 })
sh.shardCollection("ecommerce.products", { region: 1 })
sh.shardCollection("ecommerce.orders", { region: 1 })
```

If you need to enforce email uniqueness in the `users` collection, you must create a **compound unique index** (after sharding) like so:

```js
db.users.createIndex({ region: 1, email: 1 }, { unique: true })
```

> ⚠️ Note: MongoDB requires the shard key to be included in any unique index for sharded collections.


## 🧪 6. Test the App

Install dependencies:

```bash
npm install
```

Run the server:

```bash
node app.js
```

Your Express server:

- Connects via `mongos`
- Uses middleware to read `x-region` from headers
- Inserts + queries data per-region

---

## 📚 API Usage Guide

### 🟢 Public Routes (`/public`)

|Endpoint|Method|Description|Headers|Body Params|Returns|
|---|---|---|---|---|---|
|`/public/products`|GET|Get all available products|`x-region`|—|200 OK – array of products|
|`/public/register`|POST|Register a new user|`x-region`|`name`, `email`, `password` (≥6), `address.{street,city,postalCode,country}`, `region`|201 Created – user object400 Bad Request|
|`/public/health`|GET|Ping endpoint to check server health|—|—|200 OK – status message|

### 🔵 User Routes (`/user`)

> All require headers: `x-user-email`, `x-user-password`, `x-region`

|Endpoint|Method|Description|Headers|Body Params|Returns|
|---|---|---|---|---|---|
|`/user/profile`|GET|Get current authenticated user|✅|—|200 OK – user object|
|`/user/orders`|GET|Get current user's orders|✅|—|200 OK – array of orders|
|`/user/orders`|POST|Place a new order|✅|`items[].productId`, `items[].quantity` (≥1), `totalPrice`|201 Created – new order400 Validation error|
|`/user/reviews`|GET|Get all reviews by the user|✅|—|200 OK – array of reviews|
|`/user/reviews`|POST|Add review to a product|✅|`productId`, `rating` (1–5), `comment` (≥5 chars)|201 Created – updated product400 Bad Request|
|`/user/spending`|GET|Get total spending by the user|✅|—|200 OK – `{ totalSpent }`|

### 🔴 Admin Routes (`/admin`)

> All require headers: `x-admin-secret`, `x-region`

|Endpoint|Method|Description|Headers|Body Params|Returns|
|---|---|---|---|---|---|
|`/admin/users`|GET|List all users in region|✅|—|200 OK – array of users|
|`/admin/orders`|GET|View all orders in region|✅|—|200 OK – array of orders|
|`/admin/reviews`|GET|View all reviews in region|✅|—|200 OK – array of reviews|
|`/admin/products`|POST|Add a new product|✅|`name`, `description` (≥10), `price`, `category`, `regions[]`|201 Created – product400 Bad Request|
|`/admin/product/:id`|DELETE|Remove a product by ID|✅|—|200 OK – success message404 Not Found|

---

## 🛠 Troubleshooting

- Make sure all windows stay open
- Restart any crashed node
- Use:
    - `rs.status()` inside each replica
    - `sh.status()` inside `mongos`
- Cluster failing? Delete `mongo-cluster/` folders and reinitialize

---

## 🛑 Stop All MongoDB Processes

```bat
taskkill /F /IM mongod.exe >nul
taskkill /F /IM mongos.exe >nul
```

---
