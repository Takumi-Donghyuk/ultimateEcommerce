const { getAll, create, remove, update, login } = require('../controllers/user.controllers');
const express = require('express');
const { verifyJwt } = require('../utils/verify');

const routerUser = express.Router();

routerUser.route('/')
  .get(verifyJwt, getAll)
  .post(create);

routerUser.route('/login') 
  .post(login)

routerUser.route('/me') 
  .get(verifyJwt, login)

routerUser.route('/:id')
  .delete(verifyJwt, remove)
  .put(verifyJwt, update);

module.exports = routerUser;