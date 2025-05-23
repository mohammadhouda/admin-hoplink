/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.deleteUserAndData = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // Verify that the request is a POST request
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const idToken = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      if (!decodedToken.admin) {
        return res.status(403).json({ error: "Only admins can delete users" });
      }

      const { uid } = req.body;

      if (!uid) {
        return res.status(400).json({ error: "Missing UID in request body" });
      }

      await admin.auth().deleteUser(uid);
      await admin.database().ref(`users/${uid}`).remove();

      return res
        .status(200)
        .json({ message: "User and data successfully deleted" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Failed to delete user" });
    }
  });
});
