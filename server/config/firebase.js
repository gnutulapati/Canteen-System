const admin = require("firebase-admin");

let serviceAccount;

try {
  // Check if base64 encoded service account is provided (for Render deployment)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    console.log("Using base64-encoded Firebase service account...");
    const base64String = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    const jsonString = Buffer.from(base64String, "base64").toString("utf-8");
    serviceAccount = JSON.parse(jsonString);
  }
  // Otherwise, use file path (for local development)
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.log("Using Firebase service account from file...");
    const path = require("path");
    // Resolve path relative to server root, not config folder
    const serviceAccountPath = path.resolve(
      __dirname,
      "../",
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    );
    serviceAccount = require(serviceAccountPath);
  } else {
    throw new Error(
      "No Firebase service account configured. Set either FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_SERVICE_ACCOUNT_KEY"
    );
  }

  // Initialize Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin SDK Initialized Successfully");
} catch (error) {
  console.error("❌ Firebase Initialization Error:", error.message);
  console.error("Stack:", error.stack);
  process.exit(1);
}

module.exports = admin;
