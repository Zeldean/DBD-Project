const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:30000";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB via mongos");

    const db = client.db("ecommerce");
    const products = db.collection("products");

    // Insert a test product
    const result = await products.insertOne({
      name: "Clustered Laptop",
      region: "Europe"
    });

    console.log("Inserted product with _id:", result.insertedId);

    // Fetch and display all products
    const allProducts = await products.find().toArray();
    console.log("All products:", allProducts);
  } catch (err) {
    console.error("❌ Connection or operation failed:", err);
  } finally {
    await client.close();
  }
}

run();
