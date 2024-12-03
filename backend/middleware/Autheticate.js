const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
    // Read token from the Authorization header (Bearer token)
    const token = req.headers.authorization?.split(' ')[1]; // Get token after 'Bearer'

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by the ID encoded in the token
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        // Attach the user object to the request
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticate;
