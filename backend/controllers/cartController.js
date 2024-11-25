const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get cart items for a user
const getCartItem = async (req, res, next) => {
    const { userId } = req.body;

    try {
        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Retrieve all cart items for the user
        const userCart = await prisma.cartItem.findMany({
            where: { userId: userId },
            include: {
                product: true, // Include product details for each cart item
            }
        });

        if (userCart.length === 0) {
            return res.status(404).json({ error: 'No items in cart for this user' });
        }

        res.status(200).json({ message: 'Cart items retrieved', cart: userCart });
    } catch (error) {
        next(error);
    }
};


// Add item to cart
const addItemToCart = async (req, res, next) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Check if userId and productId are provided
        if (!userId || !productId) {
            return res.status(400).json({ error: 'User ID and Product ID are required' });
        }

        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the user already has this product in their cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                userId: userId,
                productId: productId
            }
        });

        if (existingItem) {
            return res.status(400).json({ error: 'Product already in cart' });
        }

        // Create new cart item
        const newItem = await prisma.cartItem.create({
            data: {
                quantity: quantity,
                user: {
                    connect: { id: userId } // Connect the user by their ID
                },
                product: {
                    connect: { id: productId } // Connect the product by its ID
                }
            }
        });

        res.status(201).json({ message: 'Item added to cart', item: newItem });
    } catch (error) {
        next(error);
    }
};

// Update item in the cart (change quantity)
const updateCartItem = async (req, res, next) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Find the cart item
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                userId: userId,
                productId: productId
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Update the quantity of the cart item
        const updatedItem = await prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity: quantity }
        });

        res.status(200).json({ message: 'Cart item updated', item: updatedItem });
    } catch (error) {
        next(error);
    }
};

// Delete item from cart
const deleteCartItem = async (req, res, next) => {
    const { userId, productId } = req.body;

    try {
        // Find the cart item to delete
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                userId: userId,
                productId: productId
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Delete the cart item
        await prisma.cartItem.delete({
            where: { id: cartItem.id }
        });

        res.status(200).json({ message: 'Cart item deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCartItem,
    addItemToCart,
    updateCartItem,
    deleteCartItem,
};
