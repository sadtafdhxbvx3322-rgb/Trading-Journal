const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

exports.handler = async function(event, context) {
  // Sirf GET request allow karenge (kyunki data lena hai)
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const database = (await clientPromise).db("TradingJournal");
    const collection = database.collection("Trades");

    // Saari trades nikalna, naye se purane ki taraf sort karke
    const trades = await collection.find({}).sort({ date: -1 }).toArray();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trades),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
