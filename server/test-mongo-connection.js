const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB with URI:', uri.replace(/\/\/.*?:.*?@/, '//****:****@'));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Try with a simpler connection
    console.log("Attempting to connect with simplified options...");
    
    try {
      const simpleClient = new MongoClient(uri);
      await simpleClient.connect();
      await simpleClient.db("admin").command({ ping: 1 });
      console.log("Simplified connection successful!");
      await simpleClient.close();
    } catch (simpleError) {
      console.error("Simplified connection also failed:", simpleError);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);