const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'], // Add your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
})); 
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));
// app.use('/api/categories', require('./routes/categories'));
app.use('/api/featured', require("./routes/featured"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/owner", require("./routes/owner"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/quick-order", require("./routes/quickOrder"));



// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Astro Crackers API Server Running!" });
});

// Error handling middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Database connection (modern way, no deprecated options)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // no need for options
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

connectDB();
