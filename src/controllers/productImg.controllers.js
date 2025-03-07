const catchError = require('../utils/catchError');
const ProductImg = require('../models/ProductImg');
const path = require('path')
const fs = require('fs')

const getAll = catchError(async (req, res) => {
  const results = await ProductImg.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
  // Obtención del nombre del archivo
  const { filename } = req.file
  //Búsqueda de la imagen en la base de datos
  const imageDB = await ProductImg.findOne({ where: { filename } })
  if (imageDB) return res.sendStatus(404)
  // Confeccionamiento de la URL de la imagen
  const url = `${req.protocol}://${req.headers.host}/uploads/${filename}`
  // Creación de la imagen en la base de datos
  const result = await ProductImg.create({ filename, url });
  return res.status(201).json(result);
});


const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await ProductImg.findByPk(id)
  if (!result) return res.sendStatus(404)
  const imageFilePath = path.join(__dirname, '..', 'public', 'uploads', result.filename)
  fs.unlinkSync(imageFilePath)
  await result.destroy()
  return res.sendStatus(204);
});

module.exports = {
  getAll,
  create,
  remove,
}