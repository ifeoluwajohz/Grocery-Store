const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get cart items for the authenticated user
const getCartItem = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from authenticated user

        // Retrieve all cart items for the user
        const userCart = await prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: true, // Include product details for each cart item
            }
        });

        if (userCart.length === 0) {

            return res.send({ cart: {} });
        }

        res.status(200).json({cart: userCart});

    } catch (error) {
        res.status(400).json({ error: error.message });

    }
};

// Add item to cart for authenticated user
const addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const userId = req.user.id; // Extract user ID from authenticated user

        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Product ID and quantity are required' });
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
                userId,
                productId
            }
        });

        if (existingItem) {
            return res.status(400).json({ error: 'Product already in cart' });
        }

        // Create new cart item
        const newItem = await prisma.cartItem.create({
            data: {
                quantity,
                userId,
                productId
            }
        });

        res.status(201).json({ message: 'Item added to cart', item: newItem });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Update item in the cart (change quantity)
const updateCartItem = async (req, res) => {
    const { productId } = req.query;
    const { quantity } = req.body;

    try {
        const userId = req.user.id; // Extract user ID from authenticated user

        // Find the cart item
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                userId,
                productId
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Update the quantity of the cart item
        const updatedItem = await prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity }
        });

        res.status(200).json({ message: 'Cart item updated', item: updatedItem });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const decreaseCartItemQuantity = async (req, res) => {
    const { productId } = req.query;
  
    try {
      const userId = req.user.id; // Extract user ID from authenticated user
  
      // Find the cart item
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId,
        },
      });
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
  
      const newQuantity = cartItem.quantity - 1;
  
      // Check if quantity becomes negative after decrease
      if (newQuantity < 0) {
        return res.status(400).json({ error: 'Cannot decrease quantity below 0' });
      }
  
      // Update the quantity of the cart item
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity },
      });
  
      res.status(200).json({ message: 'Cart item quantity decreased', item: updatedItem });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const increaseCartItemQuantity = async (req, res) => {
    const { productId } = req.query;
  
    try {
      const userId = req.user.id; // Extract user ID from authenticated user
  
      // Find the cart item
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId,
        },
      });
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
  
      const newQuantity = cartItem.quantity + 1;
  
      // Update the quantity of the cart item
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity },
      });
  
      res.status(200).json({ message: 'Cart item quantity increased', item: updatedItem });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete item from cart
const deleteCartItem = async (req, res) => {
    const { productId } = req.query;

    try {
        const userId = req.user.id; // Extract user ID from authenticated user

        // Find the cart item to delete
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                userId,
                productId
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
        res.status(400).json({ error: error.message });
    }
};

const deleteAllCartItems = async (req, res) => {
    try {
      const userId = req.user.id; // Extract user ID from authenticated user
  
      // Delete all cart items for the user
      await prisma.cartItem.deleteMany({
        where: { userId },
      });
  
      res.status(200).json({ message: 'All cart items deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  module.exports = {
    getCartItem,
    addItemToCart,
    updateCartItem,
    deleteCartItem,
    deleteAllCartItems,
    decreaseCartItemQuantity,
    increaseCartItemQuantity,
  };