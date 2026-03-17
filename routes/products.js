var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products');
let inventoryModel = require('../schemas/inventory'); // ← thêm dòng này

const { default: slugify } = require('slugify');

router.get('/', async function (req, res, next) {
  let queries = req.query;
  let minPrice = parseInt(queries.minprice) || 0;
  let maxPrice = parseInt(queries.maxprice) || 999999999;
  let titleQ = queries.title ? queries.title : '';

  let result = await productModel.find({
    isDeleted: false,
    title: new RegExp(titleQ, 'i'),
    price: {
      $gte: minPrice,
      $lte: maxPrice
    }
  }).populate({
    path: 'category',
    select: 'name'
  });

  res.send(result);
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findOne({
      isDeleted: false,
      _id: id
    });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post('/', async function (req, res, next) {
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title, {
        replacement: '-',
        lower: true,
        strict: false,
      }),
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      images: req.body.images
    });
    await newProduct.save(); // hook post('save') tự tạo inventory

    // Query inventory vừa được tạo bởi hook
    const inventory = await inventoryModel.findOne({ product: newProduct._id });

    res.send({ product: newProduct, inventory });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await productModel.findByIdAndUpdate(id, req.body, {
      new: true
    });
    if (!updatedItem) {
      return res.status(404).send({ message: "ID NOT FOUND" });
    }
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await productModel.findByIdAndUpdate(id, {
      isDeleted: true
    }, {
      new: true
    });
    if (!updatedItem) {
      return res.status(404).send({ message: "ID NOT FOUND" });
    }
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;