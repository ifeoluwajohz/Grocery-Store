const admin = require('./firebase'); // Import Firebase setup

const verifyFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.firebaseId = decodedToken.uid; // Attach Firebase ID to request
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = verifyFirebaseToken;
