const { PrismaClient } = require('@prisma/client'); 
const admin = require("firebase-admin");
const jwt = require('jsonwebtoken'); // For generating the token

const prisma = new PrismaClient(); 

const serviceAccount = require("../config/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// // Function to generate JWT
// const generateToken = (userId) => {
//     const payload = { userId };
//     return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); 
// };

const generateToken = (userId) =>{
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

// Controller for user registration
const registerUser = async (req, res, next) => {
    const { idToken } = req.body;

    try {
        if (!idToken) {
            return res.status(400).json({ error: "ID token is required" });
        }

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

        const token = generateToken(user.id); // Generate JWT
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({ message: "User authenticated successfully", user });

    } catch (error) {
        console.error("Error verifying ID token:", error.message);
        res.status(400).json({ error: "Invalid token" });
    }
};

// Controller for user login
const loginUser = async (req, res) => {
    const { idToken } = req.body;

    try {
        if (!idToken) {
            return res.status(400).json({ error: "ID token is required" });
        }

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

        const token = generateToken(user.id); // Generate JWT

        // Send the token in the response body, instead of setting it as a cookie
        res.status(200).json({
            message: "LoggedIn successfully",
            user,
            token, // Send token in response
        });
        console.log(idToken);

    } catch (error) {
        console.error("Error verifying ID token:", error.message);
        res.status(400).json({ error: "Invalid token" });
    }
};


// Controller for fetching profile
const profile = async (req, res) => {
    try {
        const user = req.user; // Populated by `authenticate` middleware

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    profile,
};
