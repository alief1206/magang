# Project Magang

Project ini memakai React untuk front-end dan Express + MySQL untuk back-end.

## Struktur Project

```txt
client/   Aplikasi front-end React + Vite
server/   API back-end Express + MySQL
```

## Teknologi

Front-end:

- React
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React

Back-end:

- Express
- MySQL2
- CORS
- Dotenv
- Helmet
- Compression
- Nodemon
- Crypto bawaan Node.js untuk enkripsi data, hash password, dan token login

Catatan: fitur AI/chatbot dikembangkan sendiri dan tidak memakai API AI eksternal.

## Menjalankan Front-end

```powershell
cd C:\alief\magang\client
npm.cmd run dev
```

Default front-end:

```txt
http://localhost:5173
```

## Menjalankan Back-end

```powershell
cd C:\alief\magang\server
npm.cmd run dev
```

Default back-end:

```txt
http://localhost:5000
```

## Konfigurasi Back-end

File konfigurasi ada di:

```txt
server/.env
```

Contoh isi:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=desa_digital_db
AUTH_TOKEN_SECRET=ganti-secret-token-minimal-32-karakter
DATA_ENCRYPTION_KEY=ganti-key-enkripsi-data-minimal-32-karakter
WHATSAPP_WEBHOOK_SECRET=ganti-secret-webhook-whatsapp
```

## Database MySQL

Pastikan MySQL sudah menyala dan konfigurasi `.env` sudah benar, lalu jalankan:

```powershell
cd C:\alief\magang\server
npm.cmd run db:migrate
```

Migration akan membuat tabel:

- `users`
- `kelurahans`
- `chat_conversations`
- `chat_messages`
- `citizen_aspirations`
- `aspiration_responses`

## Role User

Role yang disiapkan:

- `warga`
- `admin`
- `lurah`

Middleware admin sudah disiapkan di:

```txt
server/src/middlewares/adminMiddleware.js
```

Token login sudah berisi `id`, `role`, dan `kelurahanId`. Untuk alur saat ini, warga tidak perlu login untuk mengirim aspirasi. Login dipakai untuk admin yang mengelola dashboard.

Header yang dipakai untuk endpoint yang butuh login:

```txt
Authorization: Bearer <token>
```

## Enkripsi Data

Data sensitif disimpan dalam bentuk terenkripsi di MySQL memakai AES-256-GCM:

- nama user
- alamat user
- nomor telepon user
- subject chat
- isi pesan chat
- nama pelapor aspirasi
- alamat pelapor aspirasi
- judul singkat aspirasi
- deskripsi aspirasi
- tanggapan aspirasi
- nomor WhatsApp pengirim aspirasi
- nomor WhatsApp lurah

Password tidak dienkripsi, tetapi di-hash memakai `scrypt`, sehingga tidak bisa dibuka kembali.

Jika database sudah berisi data lama sebelum fitur enkripsi dibuat, jalankan:

```powershell
cd C:\alief\magang\server
npm.cmd run data:encrypt
```

## Endpoint Utama

Health check:

```txt
GET /health
```

Chatbot lokal sederhana:

```txt
POST /api/chat
```

Auth:

```txt
POST /api/auth/register
POST /api/auth/login
```

Kelurahan:

```txt
GET    /api/kelurahans
GET    /api/kelurahans/:id
POST   /api/kelurahans
PUT    /api/kelurahans/:id
DELETE /api/kelurahans/:id
```

Data kelurahan bisa menyimpan `lurahName` dan `lurahWhatsappNumber`. Nomor ini dipakai saat admin meneruskan chat website ke WhatsApp lurah.

## Endpoint CRUD User

```txt
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

## Endpoint CRUD Chat

```txt
GET    /api/chats
POST   /api/chats
GET    /api/chats/:id
PUT    /api/chats/:id
DELETE /api/chats/:id
POST   /api/chats/:id/forward-to-lurah
POST   /api/chats/:id/messages
PUT    /api/chats/:id/messages/:messageId
DELETE /api/chats/:id/messages/:messageId
```

Chat di dashboard hanya dikelola admin. Jika admin meneruskan chat ke lurah, endpoint `forward-to-lurah` akan membuat link WhatsApp berisi format balasan:

```txt
CHAT-1: tulis balasan di sini
```

Balasan lurah dari WhatsApp bisa masuk kembali ke chat website melalui webhook WhatsApp.

## Endpoint CRUD Aspirasi Warga

```txt
GET    /api/aspirations
POST   /api/aspirations
GET    /api/aspirations/:id
PUT    /api/aspirations/:id
DELETE /api/aspirations/:id
POST   /api/aspirations/:id/responses
PUT    /api/aspirations/:id/responses/:responseId
DELETE /api/aspirations/:id/responses/:responseId
```

Alur warga:

- Warga tidak perlu login.
- Warga mengisi data diri dari pop-up/form.
- Front-end mengirim data ke `POST /api/aspirations`.
- Field minimal: `kelurahanId`, `name`, `address`, `category`, `shortTitle`, `description`.

Alur admin:

- Admin login.
- Admin hanya melihat aspirasi sesuai `kelurahanId` di token login.
- Admin bisa mengubah status, menghapus, dan memberi tanggapan.

Data aspirasi warga yang disiapkan:

- nama
- alamat
- kategori
- judul singkat
- deskripsi
- gambar
- status laporan
- tujuan penanganan admin atau lurah

## Upload Gambar Aspirasi

Folder upload gambar:

```txt
server/uploads/aspirations
```

Gambar tidak disimpan langsung ke MySQL. File gambar disimpan di folder upload, sedangkan database hanya menyimpan path dan metadata seperti nama file, tipe file, ukuran asli, path hasil kompresi, dan ukuran hasil kompresi.

Fungsi auto compress gambar sudah disiapkan sebagai kerangka di:

```txt
server/src/services/imageCompressionService.js
```

Nanti fungsi upload dan kompres gambar bisa dikembangkan setelah alur form aspirasi di front-end dibuat.

## WhatsApp Webhook

Endpoint webhook yang disiapkan:

```txt
POST /api/whatsapp/webhook/aspirations
POST /api/whatsapp/webhook/chat-replies
```

Header webhook:

```txt
x-webhook-secret: isi-sama-dengan-WHATSAPP_WEBHOOK_SECRET
```

Contoh payload aspirasi dari WhatsApp:

```json
{
  "kelurahanId": 1,
  "fromName": "Budi",
  "fromPhone": "081234567890",
  "messageId": "wa-msg-1",
  "message": "Nama: Budi\nAlamat: RT 01/RW 02\nKategori: Jalan\nJudul: Jalan rusak\nDeskripsi: Jalan depan balai berlubang"
}
```

Contoh payload balasan lurah dari WhatsApp:

```json
{
  "fromPhone": "081234567891",
  "messageId": "wa-reply-1",
  "message": "CHAT-1: Baik, akan kami tindaklanjuti."
}
```

Catatan: agar pesan WhatsApp benar-benar masuk otomatis, perlu WhatsApp Business API atau provider WhatsApp yang meneruskan pesan masuk ke webhook ini.

## Catatan Development

Jika PowerShell memblokir `npm` atau `npx`, gunakan versi `.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
npx.cmd tailwindcss init -p
```

Jika migration gagal dengan:

```txt
ECONNREFUSED
```

Berarti MySQL belum menyala atau konfigurasi host/port/password di `.env` belum sesuai.
