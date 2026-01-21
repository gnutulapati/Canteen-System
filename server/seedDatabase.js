const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");
const dotenv = require("dotenv");

dotenv.config();

const menuItems = [
  {
    name: "Morning Breakfast",
    category: "Breakfast",
    price: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop",
    isAvailable: true,
  },
  {
    name: "Full Lunch Thali",
    category: "Lunch",
    price: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    isAvailable: true,
  },
  {
    name: "Evening Snacks",
    category: "Snacks",
    price: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    isAvailable: true,
  },
  {
    name: "Dinner Special",
    category: "Dinner",
    price: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    isAvailable: true,
  },
  {
    name: "Tea/Coffee",
    category: "Drinks",
    price: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop",
    isAvailable: true,
  },
  {
    name: "Fresh Juice",
    category: "Drinks",
    price: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
    isAvailable: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.psuqk.mongodb.net/canteenDB`
    );

    console.log("✅ Connected to MongoDB");

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log("🗑️  Cleared existing menu items");

    // Insert new menu items
    const result = await MenuItem.insertMany(menuItems);
    console.log(`✅ Inserted ${result.length} menu items`);

    console.log("\n📋 Menu Items:");
    result.forEach((item) => {
      console.log(`  - ${item.name} (${item.category}) - ₹${item.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
