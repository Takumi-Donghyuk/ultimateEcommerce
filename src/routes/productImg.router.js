const { getAll, create, remove } = require('../controllers/productImg.controllers');
const express = require('express');
const connectUp = require('../utils/multer');

const routerProductImg = express.Router();

routerProductImg.route('/')
  .get(getAll)
  .post(connectUp.single('image'), create);


routerProductImg.route('/:id')
  .delete(remove)

module.exports = routerProductImg;