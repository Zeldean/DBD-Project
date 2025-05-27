# 🧠 MongoDB Sharded Cluster Simulation (DBD381 Project)
This project simulates a fully distributed NoSQL database system using **MongoDB replica sets and sharding** — all locally on one machine. It includes scripts to run config servers, multiple regional shards (EU, Asia, US), a `mongos` router, and a sample Node.js app to test the setup.

---
## 🚀 Prerequisites
Before you begin, make sure you have the following installed on your PC:

### ✅ Required Tools

- **MongoDB (Community Edition)** with access to:
  - `mongod`
  - `mongos`
  - `mongosh`
- **Node.js + npm** (for the test app)

### 📦 MongoDB Download

> https://www.mongodb.com/try/download/community

During installation:
- ✅ Add to PATH
- ✅ Install `mongosh` shell if not bundled

---

## 📁 Project Structure

```

project-root/
├── mongo-cluster/           # All database folders (created automatically or by setup script)
│   ├── cfg1/, cfg2/, cfg3/  # Config server data folders
│   ├── rs\_eu1/, rs\_eu2/     # EU shard nodes
│   ├── rs\_asia1/, rs\_asia2/ # Asia shard nodes
│   └── rs\_us1/, rs\_us2/     # US shard nodes
├── scripts/                 # All startup .bat scripts
│   └── start-cluster.bat    # Launches the full cluster
├── app.js                   # Node.js test script
├── package.json             # Node app dependencies
└── README.md                # This file

```

> Empty folders use `.gitkeep` files to ensure they exist in Git.

---

## ⚙️ Setup Steps

### 📁 1. Create Folder Structure

You can use the pre-written script:
```

scripts/setup-folders.bat

````
Or manually create all folders under `mongo-cluster/` as listed above.

---

### 🔋 2. Start the MongoDB Cluster

Run the master startup script:

```bat
scripts/start-cluster.bat
````

This will:

* Start 3 config servers
* Start 6 shard nodes (3 regions × 2 replicas each)
* Start the `mongos` router on port **30000**

Each node opens in a separate PowerShell window and stays open.

---

### 🔌 3. Initialize Replica Sets

Use `mongosh` to connect to each **first replica** and initiate its set:

#### EU:

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

#### Asia:

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

#### US:

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

### 🧠 4. Add Shards to the Cluster

Connect to the router:

```bash
mongosh --port 30000
```

Add each shard by replica set name:

```js
sh.addShard("rs_eu/localhost:27001,localhost:27002")
sh.addShard("rs_asia/localhost:27101,localhost:27102")
sh.addShard("rs_us/localhost:27201,localhost:27202")
```

---
## 🧪 5. Test with Node.js
Install the Node dependencies:

```bash
npm install
```

Then run the app:

```bash
node app.js
```

This will:

* Connect via the `mongos` router
* Insert a document into the `ecommerce.products` collection
* Print all existing products to the console

---

## 📂 Optional: Enable Sharding
Once your schema is ready, enable sharding:

```js
sh.enableSharding("ecommerce")
sh.shardCollection("ecommerce.products", { region: 1 })
```

---
## 🛠 Troubleshooting
* Make sure all `mongod` and `mongos` windows are open
* Ensure no folder permissions or locked files block startup
* Use `rs.status()` and `sh.status()` inside `mongosh` to debug

---

## 🔚 To Stop the Cluster
You can manually close all windows or create a shutdown script to kill all `mongod` and `mongos` processes:

```bat
taskkill /F /IM mongod.exe >nul
taskkill /F /IM mongos.exe >nul
```

---

