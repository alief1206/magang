function successResponse(res, data, message = 'Berhasil.', statusCode = 200) {
  return res.status(statusCode).json({
    message,
    data,
  })
}

module.exports = {
  successResponse,
}
