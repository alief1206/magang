async function register(payload) {
  // Isi proses validasi, hash password, dan simpan user di sini.
  return {
    email: payload.email,
  }
}

async function login(payload) {
  // Isi proses cek user, cek password, dan buat session/token di sini.
  return {
    email: payload.email,
  }
}

module.exports = {
  register,
  login,
}
