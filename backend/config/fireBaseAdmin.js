const admin = require("firebase-admin");

// Load the service account key
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export the admin object for use in other files
module.exports = admin;
