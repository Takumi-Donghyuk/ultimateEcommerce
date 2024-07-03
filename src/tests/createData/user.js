const User = require("../../models/User")

const user = async () => {
  const body = {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juanperez@gmail.com",
    password: "2467juper",
    phone: "576574569099"
  }

  await User.create(body)
}

module.exports = user