const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are no longer needed in Mongoose 6+, but included for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB Error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB Disconnected");
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;