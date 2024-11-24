const { PrismaClient } = require('@prisma/client'); // Prisma client for database interaction

const prisma = new PrismaClient(); // Initialize Prisma Client

// Controller for user registration
const registerUser = async (req, res, next) => {
    const { FirebaseId, name } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { firebaseId: FirebaseId },
        });

        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return; // Prevent further code execution
        }

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                firebaseId: FirebaseId,
                name
            },
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.log(error.message); // Pass error to middleware
    }
};

// Controller for user login
const loginUser = async (req, res, next) => {
    const { FirebaseId } = req.body;

    try {
        // Find the user by FirebaseId
        const user = await prisma.user.findUnique({
            where: { firebaseId: FirebaseId },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return; // Prevent further code execution
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.log(error.message); // Pass error to middleware
    }
};

const profile = async (req, res, next) => {
  try {
      const userId = req.query.firebaseId; // Assuming middleware attaches the user ID
      if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      // Fetch the user
      const user = await prisma.user.findUnique({
          where: { firebaseId: userId },
      });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ user });
  } catch (error) {
      next(error);
  }
};


// Export the controllers for use in routes
module.exports = {
    registerUser,
    loginUser,
    profile
};


