import mongoose from "mongoose";
import app from "./app";

const port = 6000;
let server;

async function main() {
  try {
    // Database connection
    await mongoose.connect(
      "mongodb+srv://mongodb:mongodb@cluster0.qcigozd.mongodb.net/library-management-app?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("✅ Connected to the cluster and DB");

    // Server connection
    server = app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Error starting the server:", err);
  }
}

main();
