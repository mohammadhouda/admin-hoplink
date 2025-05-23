const admin = require("firebase-admin");

// Load your service account key JSON file here
const serviceAccount = require("./hopelink-cca2d-firebase-adminsdk-f8cmm-693ee16987.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

admin
  .auth()
  .setCustomUserClaims("s7KMKLEsZHW3G2pN7wDrnW10H1Z2", { admin: true })
  .then(() => {
    console.log("✅ Admin claim set successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Failed to set admin claim:", err);
    process.exit(1);
  });
