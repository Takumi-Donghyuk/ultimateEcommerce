const catchError = require('../utils/catchError');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImg = require('../models/ProductImg');


const create = catchError(async (req, res) => {
  const result = await Product.create(req.body);
  return res.status(201).json(result);
});

//Setear Imágenes
const setImgs = catchError(async (req, res) => {
  const { id } = req.params
  const product = await Product.findByPk(id)
  if (!product) return res.sendStatus(404)
  await product.setProductImgs(req.body)
  const images = await product.getProductImgs()
  return res.status(200).json(images)
})


const getAll = catchError(async (req, res) => {
  const results = await Product.findAll({ include: [Category, ProductImg] });
  return res.json(results);
});


const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Product.findByPk(id, { include: [Category, ProductImg] });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Product.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Product.update(
    req.body,
    { where: { id }, returning: true }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});


module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  setImgs
}