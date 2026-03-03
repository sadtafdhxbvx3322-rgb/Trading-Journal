const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const tradeData = JSON.parse(event.body);
    const database = (await clientPromise).db("TradingJournal");
    const collection = database.collection("Trades");

    const finalDataToSave = {
      ...tradeData,
      rr: "1:2",
      timeframe: "3m",
      date: new Date().toISOString()
    };

    await collection.insertOne(finalDataToSave);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Trade successfully logged!" }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
