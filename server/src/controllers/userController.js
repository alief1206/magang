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

async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body)

    res.status(201).json({
      message: 'User berhasil ditambahkan.',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body)

    res.json({
      message: 'User berhasil diubah.',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.id)

    res.json({
      message: 'User berhasil dihapus.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
