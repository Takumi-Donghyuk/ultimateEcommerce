const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

// Create del CRUD
const create = catchError(async (req, res) => {
  const result = await User.create(req.body);
  return res.status(201).json(result);
});

// Read del CRUD
// Obtener todos los usuarios
const getAll = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.status(200).json(results);
});

// Eliminar el usuario de id especificado
const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.destroy({ where: { id } });
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});

// Update del CRUD: Actualizar la información del usuario
const update = catchError(async (req, res) => {
  const fieldsRemove = ['password', 'email'];
  /* 
    Se accede a la propiedad con notación de corchetes porque los campos son strings
    dentro del array fieldsRemove
  */
  fieldsRemove.forEach((field) => delete req.body[field]);
  const { id } = req.params;
  const result = await User.update(
    req.body,
    { where: { id }, returning: true }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});


// Login
const login = catchError(async (req, res) => {
  const { email, password } = req.body
  // Determinar si el email es de un usuario existente
  const user = await User.findOne({ where: { email } })
  if (!user) return res.sendStatus(401)
  // Determinar si la contraseña es correcta
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return res.sendStatus(401)
  const token = jwt.sign(
    { user },
    process.env.TOKEN_SECRET,
    { expiresIn: '1d' }
  )
  return res.status(200).json({ user, token })
})


// Usuario logueado
const logged = catchError(async (req, res) => {
  const userId = req.user.id
  const result = await User.findByPk(userId)
  return res.json(result)
})

module.exports = {
  getAll,
  create,
  remove,
  update,
  login,
  logged
}