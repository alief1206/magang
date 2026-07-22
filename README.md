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
```

## Database MySQL

Pastikan MySQL sudah menyala dan konfigurasi `.env` sudah benar, lalu jalankan:

```powershell
cd C:\alief\magang\server
npm.cmd run db:migrate
```

Migration akan membuat tabel:

- `users`
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

Route CRUD belum dikunci penuh ke admin karena fitur login/token belum dibuat. Setelah fitur login selesai, route admin tinggal dipasangi middleware tersebut.

## Endpoint Utama

Health check:

```txt
GET /health
```

Chatbot lokal sederhana:

```txt
POST /api/chat
```

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
POST   /api/chats/:id/messages
PUT    /api/chats/:id/messages/:messageId
DELETE /api/chats/:id/messages/:messageId
```

Chat ini disiapkan untuk menyimpan percakapan warga yang perlu dibalas oleh admin atau lurah.

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
