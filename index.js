const express = require("express");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Firebase Setup
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "opa-need.firebasestorage.app", // update with your bucket
});
const bucket = admin.storage().bucket();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Multer for local file temp upload
const upload = multer({ dest: 'uploads/' });

// Upload multiple images
app.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const urls = [];

    for (const file of req.files) {
      const filePath = path.join(__dirname, file.path);
      const destination = `uploads/${Date.now()}-${file.originalname}`;

      // Upload to Firebase Storage
      await bucket.upload(filePath, {
        destination,
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Make file public (optional)
      const firebaseFile = bucket.file(destination);
      await firebaseFile.makePublic();

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
      urls.push(publicUrl);

      // Remove temp file
      fs.unlinkSync(filePath);
    }

    res.json({ urls });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
});

// MongoDB connection
// mongoose
//   .connect("mongodb+srv://talhaali21cv:tyCnq4g7drn1PZzH@cluster0.jsmg5yb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//   .then(() => {
//     console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
//   })
//   .catch((err) => {
//     console.error("MongoDB Connection Error:", err);
//   });
