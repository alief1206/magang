const userModel = require('../models/userModel')

async function getUsers() {
  return userModel.findAll()
}

async function getUserById(id) {
  return userModel.findById(id)
}

module.exports = {
  getUsers,
  getUserById,
}
