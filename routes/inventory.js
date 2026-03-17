const express = require('express');
const router = express.Router();
const Inventory = require('../schemas/inventory');

// GET all inventory (có join với product)
router.get('/api/v1/inventory', async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product');
        res.json(inventories);
    } catch (err) {
        res.status(500).json({ message: 'Loi lay danh sach inventory', error: err });
    }
});

// GET inventory by ID (có join với product)
router.get('/api/v1/inventory/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory khong ton tai' });
        }
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: 'Loi lay inventory', error: err });
    }
});

// POST /api/v1/inventory/add_stock
router.post('/api/v1/inventory/add_stock', async (req, res) => {
    const { product, quantity } = req.body;
    if (!product || typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'Thieu product hoac quantity khong hop le' });
    }
    try {
        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory khong ton tai' });
        }
        inventory.stock += quantity;
        await inventory.save();
        res.json({ message: 'Da tang stock', inventory });
    } catch (err) {
        res.status(500).json({ message: 'Loi tang stock', error: err });
    }
});

// POST /api/v1/inventory/remove_stock
router.post('/api/v1/inventory/remove_stock', async (req, res) => {
    const { product, quantity } = req.body;
    if (!product || typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'Thieu product hoac quantity khong hop le' });
    }
    try {
        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory khong ton tai' });
        }
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Stock khong du de giam' });
        }
        inventory.stock -= quantity;
        await inventory.save();
        res.json({ message: 'Da giam stock', inventory });
    } catch (err) {
        res.status(500).json({ message: 'Loi giam stock', error: err });
    }
});

// POST /api/v1/inventory/reservation
router.post('/api/v1/inventory/reservation', async (req, res) => {
    const { product, quantity } = req.body;
    if (!product || typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'Thieu product hoac quantity khong hop le' });
    }
    try {
        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory khong ton tai' });
        }
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Stock khong du de dat truoc' });
        }
        inventory.stock -= quantity;
        inventory.reserved += quantity;
        await inventory.save();
        res.json({ message: 'Da dat truoc', inventory });
    } catch (err) {
        res.status(500).json({ message: 'Loi dat truoc', error: err });
    }
});

// POST /api/v1/inventory/sold
router.post('/api/v1/inventory/sold', async (req, res) => {
    const { product, quantity } = req.body;
    if (!product || typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'Thieu product hoac quantity khong hop le' });
    }
    try {
        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory khong ton tai' });
        }
        if (inventory.reserved < quantity) {
            return res.status(400).json({ message: 'Reserved khong du de ban' });
        }
        inventory.reserved -= quantity;
        inventory.soldCount += quantity;
        await inventory.save();
        res.json({ message: 'Da ban', inventory });
    } catch (err) {
        res.status(500).json({ message: 'Loi ban', error: err });
    }
});

module.exports = router;
