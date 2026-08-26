function getRoot(_req, res) {
  res.json({
    message: 'Server API is running',
  })
}

module.exports = {
  getRoot,
}
