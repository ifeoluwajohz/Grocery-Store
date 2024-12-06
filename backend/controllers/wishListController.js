const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get wishlist items for the authenticated user
const getWishlistItems = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from authenticated user

        // Retrieve all wishlist items for the user
        const userWishlist = await prisma.wishlistItem.findMany({
            where: { userId },
            include: {
                product: true, // Include product details for each wishlist item
            }
        });

        if (userWishlist.length === 0) {
            return res.send({ wishlist: {} });
        }

        res.status(200).json({ wishlist: userWishlist });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add item to wishlist for authenticated user
const addItemToWishlist = async (req, res) => {
    const { productId } = req.body;

    try {
        const userId = req.user.id; // Extract user ID from authenticated user

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the user already has this product in their wishlist
        const existingItem = await prisma.wishlistItem.findFirst({
            where: {
                userId,
                productId
            }
        });

        if (existingItem) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        // Create new wishlist item
        const newItem = await prisma.wishlistItem.create({
            data: {
                userId,
                productId
            }
        });

        res.status(201).json({ message: 'Item added to wishlist', item: newItem });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Remove item from wishlist
const removeItemFromWishlist = async (req, res) => {
    const { productId } = req.query;

    try {
        const userId = req.user.id; // Extract user ID from authenticated user

        // Find the wishlist item to delete
        const wishlistItem = await prisma.wishlistItem.findFirst({
            where: {
                userId,
                productId
            }
        });

        if (!wishlistItem) {
            return res.status(404).json({ error: 'Wishlist item not found' });
        }

        // Delete the wishlist item
        await prisma.wishlistItem.delete({
            where: { id: wishlistItem.id }
        });

        res.status(200).json({ message: 'Wishlist item removed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Clear all items from wishlist
const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from authenticated user

        // Delete all wishlist items for the user
        await prisma.wishlistItem.deleteMany({
            where: { userId },
        });

        res.status(200).json({ message: 'Wishlist cleared' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getWishlistItems,
    addItemToWishlist,
    removeItemFromWishlist,
    clearWishlist
};
