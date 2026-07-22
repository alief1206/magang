# Server

Struktur back-end ini dibuat supaya setiap fitur punya tempat yang jelas.

## Folder

- `src/config`: konfigurasi environment dan database.
- `src/controllers`: menerima request dan mengirim response.
- `src/routes`: daftar endpoint API.
- `src/services`: logika utama fitur.
- `src/models`: query database.
- `src/middlewares`: middleware Express.
- `src/utils`: helper umum.
- `src/validators`: validasi request sederhana.
- `src/database`: migration dan seeder.
- `uploads`: penyimpanan file upload, termasuk gambar aspirasi warga.

## Menjalankan Server

```powershell
npm.cmd run dev
```

## Endpoint Awal

- `GET /`
- `GET /health`
- `POST /api/chat`
- `GET /api/chats`
- `POST /api/chats`
- `GET /api/chats/:id/messages`
- `POST /api/chats/:id/messages`
- `PATCH /api/chats/:id/status`
- `GET /api/aspirations`
- `POST /api/aspirations`
- `GET /api/aspirations/:id`
- `PATCH /api/aspirations/:id/status`
- `POST /api/aspirations/:id/responses`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/users/:id`

## Database

Isi `DB_NAME` di file `.env`, lalu jalankan:

```powershell
npm.cmd run db:migrate
```

Script ini akan membuat database jika belum ada, lalu menjalankan file SQL di folder
`src/database/migrations` secara berurutan:

1. `001_create_users.sql`
2. `002_create_chat_tables.sql`
3. `003_create_aspiration_tables.sql`

Gambar aspirasi tidak disimpan langsung di MySQL. Database hanya menyimpan path file,
nama file, tipe file, ukuran asli, path hasil kompresi, dan ukuran hasil kompresi.
