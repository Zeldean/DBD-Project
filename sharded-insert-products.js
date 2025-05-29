const axios = require('axios');

const regions = ['Europe', 'Asia', 'US'];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function insertProducts() {
  for (let i = 0; i < 100; i++) {
    const region = regions[i % regions.length];

    const product = {
      name: `Sharded Product ${i}`,
      description: `Auto-generated product ${i}`,
      price: random(100, 1000),
      category: i % 2 === 0 ? "electronics" : "clothing",
      stock: random(1, 50),
      seller_id: `U${random(1, 100)}`,
      region: region,
      regions: [region]
    };

    try {
      const response = await axios.post("http://localhost:5000/products", product, {
        headers: {
          "Content-Type": "application/json",
          "x-region": region
        }
      });
      console.log(`✅ Inserted product ${i + 1} to ${region}`);
    } catch (err) {
      console.error(`❌ Failed to insert product ${i + 1}:`, err.response?.data || err.message);
    }
  }
}

insertProducts();
