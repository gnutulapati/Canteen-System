const admin = require("firebase-admin");
const path = require("path");

/**
 * Initialize Firebase Admin SDK
 * This should be called once when the server starts
 */
const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log("✅ Firebase Admin already initialized");
      return;
    }

    // Get service account path from environment variable
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountPath) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set"
      );
    }

    // Initialize Firebase Admin
    const serviceAccount = require(path.resolve(serviceAccountPath));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin SDK Initialized Successfully");
  } catch (error) {
    console.error("❌ Firebase Initialization Error:", error.message);
    console.error("Make sure FIREBASE_SERVICE_ACCOUNT_KEY is set in .env file");
    // Don't exit process, but log the error
    // Server can still run for non-auth routes
  }
};

module.exports = { initializeFirebase, admin };
