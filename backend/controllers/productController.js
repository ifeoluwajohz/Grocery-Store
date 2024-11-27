const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Search for products with filtering, sorting, and pagination.
 */
const searchProduct = async (req, res, next) => {
    const { 
        name, 
        category, 
        minPrice, 
        maxPrice, 
        page = 1, 
        limit = 10, 
        sortBy = 'name', 
        order = 'asc' 
    } = req.query;

    try {
        // Build the filters dynamically
        const searchFilters = {};

        if (name) {
            searchFilters.name = {
                contains: name,
                mode: 'insensitive', // Case-insensitive search
            };
        }

        if (category) {
            searchFilters.category = category.toUpperCase(); // Ensure category matches enum
        }

        if (minPrice || maxPrice) {
            searchFilters.price = {};
            if (minPrice) searchFilters.price.gte = parseFloat(minPrice);
            if (maxPrice) searchFilters.price.lte = parseFloat(maxPrice);
        }

        // Pagination calculations
        const offset = (page - 1) * limit;

        // Query the database
        const products = await prisma.product.findMany({
            where: searchFilters,
            orderBy: { [sortBy]: order.toLowerCase() === 'desc' ? 'desc' : 'asc' },
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        // Count total products matching the criteria
        const totalProducts = await prisma.product.count({
            where: searchFilters,
        });

        if (!products.length) {
            return res.status(404).json({ message: 'No products found matching the criteria' });
        }

        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalProducts,
            products,
        });
    } catch (error) {
        next(error); // Pass error to middleware
    }
};

/**
 * Add a new product.
 */
const addProduct = async (req, res, next) => {
    const { name, price, description, image, category } = req.body;

    try {
        // Validate required fields
        if (!name || !price || !category) {
            return res.status(400).json({ error: 'Name, Price, and Category are required fields' });
        }

        // Create new product
        const newProduct = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                description: description || null,
                image: image || null,
                category: category.toUpperCase(),
            },
        });

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct,
        });
    } catch (error) {
        console.log(error);
        res.send(error)
    }
};

/**
 * Update an existing product.
 */
const updateProduct = async (req, res, next) => {
    const { id, name, price, description, image, category } = req.body;

    try {
        // Validate required fields
        if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Find the product
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update the product
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: name || product.name,
                price: price ? parseFloat(price) : product.price,
                description: description || product.description,
                image: image || product.image,
                category: category ? category.toUpperCase() : product.category,
            },
        });

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a product.
 */
const deleteProduct = async (req, res, next) => {
    const { id } = req.body;

    try {
        // Validate required fields
        if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Find the product
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the product
        await prisma.product.delete({
            where: { id },
        });

        res.status(200).json({
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Fetch all products with optional pagination.
 */
const getAllProducts = async (req, res, next) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    try {
        // Pagination calculations
        const offset = (page - 1) * limit;

        // Query the database
        const products = await prisma.product.findMany({
            orderBy: { [sortBy]: order.toLowerCase() === 'desc' ? 'desc' : 'asc' },
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        // Count total products
        const totalProducts = await prisma.product.count();

        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalProducts,
            products,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    searchProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
};
