const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add a new product
const addProduct = async (req, res, next) => {
    const { name, price, description, image } = req.body;

    try {
        // Validate that all required fields are provided
        if (!name || !price) {
            return res.status(400).json({ error: 'Name and Price are required fields' });
        }

        // Create a new product
        const newProduct = await prisma.product.create({
            data: {
                name: name,
                price: price,
                description: description || null, // Optional field
                image: image || null, // Optional field
            }
        });

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct
        });
    } catch (error) {
        next(error);
    }
};

// Example: Controller for updating product
const updateProduct = async (req, res, next) => {
    const { id, name, price, description, image } = req.body;

    try {
        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update the product
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: name || product.name, // Only update if the field is provided
                price: price || product.price,
                description: description || product.description,
                image: image || product.image
            }
        });

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        next(error);
    }
};

// Example: Controller for deleting product
const deleteProduct = async (req, res, next) => {
    const { id } = req.body;

    try {
        // Find the product by ID
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the product
        await prisma.product.delete({
            where: { id }
        });

        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct
};
