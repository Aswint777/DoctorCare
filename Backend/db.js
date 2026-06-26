const mongoose = require("mongoose");
const DATABASE_KEY = process.env.DATABASE_KEY

const database = async (req, res) => {
  try {
    console.log('database connecting .....');

    await mongoose.connect(DATABASE_KEY);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = database