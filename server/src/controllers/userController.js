const userService = require('../services/userService')

async function getUsers(_req, res, next) {
  try {
    const users = await userService.getUsers()

    res.json({
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id)

    res.json({
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
}
