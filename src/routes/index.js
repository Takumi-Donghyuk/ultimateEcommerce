const { verifyJwt } = require('../utils/verify');
const express = require('express');
// Importaciones de routers en orden
const routerUser = require('./user.router');
const routerCategory = require('./category.router');
const routerProduct = require('./product.router');
const routerCart = require('./cart.router');
const routerPurchase = require('./purchase.router');
const routerProductImg = require('./productImg.router');
const router = express.Router();

/* Rutas plurales*/ 
router.use('/users', routerUser)
router.use('/categories', routerCategory)
router.use("/products", routerProduct)
router.use('/productImgs', verifyJwt, routerProductImg)

/* Rutas singulares*/ 
router.use('/cart', verifyJwt, routerCart)  
router.use('/purchase', verifyJwt, routerPurchase)


module.exports = router;