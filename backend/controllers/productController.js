const { PrismaClient } = require('@prisma/client');
const joi = require('joi')
const prisma = new PrismaClient();

const searchProduct = async (req, res, next) => {
    const { 
        name, 
        category, 
        minPrice, 
        description,
        maxPrice, 
        page = 1, 
        limit = 10, 
        sortBy = 'name', 
        order = 'asc' 
    } = req.query;

    try {
        const searchFilters = {};

        if (name) {
            searchFilters.name = { contains: name, mode: 'insensitive' };
        }

        if (description) {
            searchFilters.description = { contains: description, mode: 'insensitive' };
        }

        if (category) {
            searchFilters.category = category.toUpperCase();
        }

        if (minPrice || maxPrice) {
            searchFilters.price = {};
            if (minPrice) searchFilters.price.gte = parseFloat(minPrice);
            if (maxPrice) searchFilters.price.lte = parseFloat(maxPrice);
        }

        const offset = (page - 1) * limit;

        const products = await prisma.product.findMany({
            where: searchFilters,
            orderBy: { [sortBy]: order.toLowerCase() === 'desc' ? 'desc' : 'asc' },
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const totalProducts = await prisma.product.count({ where: searchFilters });

        if (!products.length) {
            return res.status(404).json({ message: 'No products found matching the criteria' });
        }

        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            products,
        });
    } catch (error) {
        next(error);
        res.status(400).json({message: error.message});

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
        console.log(error.message);
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

const getSingleProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Product ID must be a valid number' });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json(error);
    }
};
const getCategory = async (req, res) => {
    const { category } = req.params;

  try {
    const products = await prisma.product.findMany({
      where: {
        category: category.toUpperCase(), // Ensure consistent case if necessary
      },
    });

    if (products.length === 0) {
      console.log({ message: 'No products found for this category' });

      return res.status(404).json({ message: 'No products found for this category' });
    }

    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

const getAllCategory = async (req, res) => {

  try {
    const categories =  await prisma.product.findMany({
        select :{
            category: true
        },
        distinct: ["category"]
    })

    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
    searchProduct,
    getCategory,
    getAllCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
};
