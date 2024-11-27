const { PrismaClient } = require('@prisma/client'); // Prisma client for database interaction
const admin = require("firebase-admin");

const prisma = new PrismaClient(); // Initialize Prisma Client

const serviceAccount = require("../config/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Controller for user registration
const registerUser = async (req, res, next) => {
    const { idToken } = req.body;

    try {
        if (!idToken) {
            return res.status(400).json({ error: "ID token is required" });
        }

        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Extract user info from the decoded token
        const { uid, name, email, picture } = decodedToken;

        // Check if the user already exists in the database
        let user = await prisma.user.findUnique({
            where: { firebaseId: uid },
        });

        if (!user) {
            // Create a new user if they don't exist
            user = await prisma.user.create({
                data: {
                    firebaseId: uid,
                    name: name || "Anonymous", // Use default name if not provided
                    email: email || null,      // Use email from token if available
                    profilePicture: picture || null, // Optional field for Google profile picture
                },
            });
        }

        res.status(201).json({ message: "User authenticated successfully", user });
        console.log({ message: "User authenticated successfully", user });

    } catch (error) {
        console.error("Error verifying ID token:", error.message);
        res.status(400).json({ error: "Invalid token" });
    }
};

// Controller for user login
const loginUser = async (req, res) => {
    const { idToken } = req.body;
  
    if (!idToken) {
      return res.status(400).json({ error: "ID token is required" });
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, name, email, picture } = decodedToken;
  
      let user = await prisma.user.findUnique({ where: { firebaseId: uid } });
  
      if (!user) {
        user = await prisma.user.create({
          data: {
            firebaseId: uid,
            name: name || "Anonymous",
            email: email || null,
            profilePicture: picture || null,
          },
        });
      }
  
      res.status(200).json({ message: "Login successful", user });
      console.log({ message: "Login successful", user });

    } catch (error) {
      console.error("Error verifying ID token:", error.message);
      res.status(400).json({ error: "Invalid token" });
    }
  };
  
  
  const profile = async (req, res, next) => {
    try {
        const idToken = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer header
        
        if (!idToken) {
            return res.status(401).json({ error: 'Unauthorized: ID token required' });
        }

        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Extract user ID (uid)
        const { uid } = decodedToken;

        // Fetch the user from Prisma
        const user = await prisma.user.findUnique({
            where: { firebaseId: uid },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error verifying ID token or fetching user:", error.message);
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ error: "Unauthorized: Token expired" });
        }
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};


// Export the controllers for use in routes
module.exports = {
    registerUser,
    loginUser,
    profile,
};
