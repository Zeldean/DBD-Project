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
│   └── individual start-\*.bat    # Start each node manually if needed
├── routes/                       # Express routers for users, products, orders
├── models/                       # Mongoose schemas with validation and region support
├── app.js                        # Main Express server
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

`.gitkeep` is used to track empty folders. MongoDB data files (`.wt`, `.turtle`, etc.) are excluded via `.gitignore`.

---

## ⚙️ Setup Steps

### 📁 1. Create Folder Structure

Run:

```ps
scripts/setup-folders.bat
```

Or manually create the folders listed under `mongo-cluster/`.

---

### 🔋 2. Start the MongoDB Cluster

Run:

```ps
scripts/start-cluster.bat
````

This starts:

- `cfg_rs` config server (1 node)
- 3 replica sets (EU, Asia, US) with 2 nodes each
- `mongos` router on port `30000`

> Each node opens in a new terminal window. Keep them open.

---

### 🧠 3. Initialize Config Server Replica Set

Connect:

```bash
mongosh --port 26001
````

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

---

### 🧱 4. Initialize Each Shard Replica Set

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

---

### 🌍 5. Add Shards to the Cluster

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

---

### 🗃️ 6. Enable Sharding on `ecommerce` Database

```js
sh.enableSharding("ecommerce")
```

Then index the shard key fields:

```js
use ecommerce
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

---

## 🧪 7. Test the App

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

## 📮 API Overview

| Route       | Method | Description                       |
| ----------- | ------ | --------------------------------- |
| `/users`    | GET    | List users in current region      |
| `/users`    | POST   | Create a user in current region   |
| `/products` | GET    | List products available in region |
| `/products` | POST   | Add new product with region list  |
| `/orders`   | GET    | List orders placed in this region |
| `/orders`   | POST   | Place a new order in this region  |

> Each request should include a header:
> `x-region: Europe` (or `Asia`, `US`)

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
