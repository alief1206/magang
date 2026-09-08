# 🏛️ Panduan Deployment Sistem Informasi & Aspirasi Warga Kelurahan (ASLI)

Dokumen ini disusun sebagai panduan teknis bagi **Tim IT / Sysadmin Dinas Komunikasi dan Informatika (Diskominfo)** untuk keperluan pengunggahan, konfigurasi, dan komisioning aplikasi pada server produksi.

---

## 📋 1. Spesifikasi & Prasyarat Server (Prerequisites)

Sebelum memulai proses instalasi, pastikan lingkungan server memenuhi persyaratan berikut:

| Komponen | Versi / Spesifikasi Minimal | Rekomendasi |
| :--- | :--- | :--- |
| **Sistem Operasi** | Linux Ubuntu Server 20.04 / 22.04 LTS atau RHEL | Ubuntu Server 22.04 LTS |
| **Node.js** | Versi 18.x LTS / 20.x LTS | Node.js v20 LTS |
| **Database** | MySQL v8.0+ / MariaDB v10.5+ | MySQL 8.0 |
| **Process Manager**| PM2 (*Node Process Manager*) | PM2 v5.x |
| **Web Server** | Nginx / Apache | Nginx Server |
| **Sertifikat SSL** | HTTPS (Let's Encrypt / Certbot / SSL Kominfo) | SSL / TLS Enabled |

---

## 📁 2. Struktur Direktori Proyek

```text
magang/
├── client/                 # Frontend (React + Vite + TailwindCSS)
│   ├── dist/               # Aset Hasil Build Produksi (Di-serve oleh Nginx)
│   ├── src/                # Kode Sumber UI Frontend
│   └── vite.config.js      # Konfigurasi Vite (Sourcemap Disabled)
│
├── server/                 # Backend (Node.js + Express.js + MySQL)
│   ├── src/                # Controllers, Models, Services, Routes, Middlewares
│   ├── uploads/            # Direktori Penyimpanan Foto Aspirasi (Uploads)
│   ├── .env.example        # Tamplat Konfigurasi Environment Variable
│   └── index.js            # Entry Point Server Express
│
└── .gitignore              # Proteksi File Terlarang & Unit Tests
```

---

## 🛠️ 3. Langkah-Langkah Deployment Lengkap (Step-by-Step)

### Langkah 1: Clone Repositori ke Server
Buka terminal server dan lakukan kloning repositori:
```bash
cd /var/www
git clone <URL_REPOSITORI_GIT> magang
cd magang
```

---

### Langkah 2: Konfigurasi Database MySQL
Masuk ke terminal MySQL dan buatkan basis data baru:
```sql
CREATE DATABASE desa_digital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'asli_user'@'localhost' IDENTIFIED BY 'PasswordKuatDiskominfo2026!';
GRANT ALL PRIVILEGES ON desa_digital_db.* TO 'asli_user'@'localhost';
FLUSH PRIVILEGES;
```

---

### Langkah 3: Setup & Deployment Backend (`server/`)

1. Masuk ke direktori server dan pasang *dependencies*:
   ```bash
   cd /var/www/magang/server
   npm install --production
   ```

2. Buat file `.env` dari `.env.example`:
   ```bash
   cp .env.example .env
   nano .env
   ```

3. Sesuaikan variabel `.env` dengan kredensial server produksi:
   ```env
   PORT=5000
   CLIENT_URL=https://layanan.banyuwangikab.go.id
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=asli_user
   DB_PASSWORD=PasswordKuatDiskominfo2026!
   DB_NAME=desa_digital_db
   AUTH_TOKEN_SECRET=KombinasiKarakterAcakMinimal32KarakterRahasiaKominfo!
   DATA_ENCRYPTION_KEY=KombinasiKeyEnkripsiDataAES256Acak32Karakter!
   WHATSAPP_WEBHOOK_SECRET=SecretWebhookWhatsappGatewayKominfo
   ```

4. Jalankan Migrasi Skema & Seeding Data Awal:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Jalankan Backend Server menggunakan **PM2 Process Manager**:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "asli-backend"
   pm2 save
   pm2 startup
   ```

---

### Langkah 4: Setup & Build Frontend (`client/`)

1. Masuk ke direktori client dan buat file `.env`:
   ```bash
   cd /var/www/magang/client
   npm install
   nano .env
   ```

2. Isikan URL API Backend pada file `.env` client:
   ```env
   VITE_API_URL=https://layanan.banyuwangikab.go.id
   ```

3. Kompilasi Aset Produksi (*Production Build*):
   ```bash
   npm run build
   ```
   *Hasil kompilasi akan berada di folder `/var/www/magang/client/dist`.*

---

### Langkah 5: Konfigurasi Nginx Web Server & Reverse Proxy

Buat file konfigurasi virtual host Nginx:
```bash
sudo nano /etc/nginx/sites-available/asli.conf
```

Isikan konfigurasi Nginx berikut:
```nginx
server {
    listen 80;
    server_name layanan.banyuwangikab.go.id;

    # Frontend Static Files (React Build)
    root /var/www/magang/client/dist;
    index index.html;

    # Compression Settings
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Uploads Static Files
    location /uploads/ {
        alias /var/www/magang/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # API Reverse Proxy ke Node.js Backend (Port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health Check Endpoint
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
    }
}
```

Aktifkan konfigurasi dan muat ulang Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/asli.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Langkah 6: Pengaktifan Sertifikat SSL (HTTPS)
Gunakan Certbot untuk mengaktifkan HTTPS secara otomatis:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d layanan.banyuwangikab.go.id
```

---

## 🔒 4. Ringkasan Fitur Keamanan Sistem (Security Audit)

Sistem telah dilengkapi dengan lapisan keamanan *cyber* tingkat lanjut:

1. **SQL Injection Shield**: Menggunakan Prepared Statements (`?`) pada seluruh query database (`mysql2`).
2. **Anti Brute-Force Rate Limiter**: Dipasang middleware `express-rate-limit` pada rute `/api/auth/login` (Maksimal 5 percobaan salah per 15 menit per IP).
3. **File Upload Security (Magic Bytes Inspection)**: Verifikasi header biner binar gambar (`FF D8 FF` / `89 50 4E 47`) untuk menolak eksekusi file `.php`/`.exe`. Nama file di-rename menggunakan Crypto UUID v4.
4. **Enkripsi Data Sensitif (AES-256-GCM)**: Identitas pribadi warga (Nama, Telepon, Alamat) dienkripsi di database.
5. **Security Headers (Helmet.js)**: Perlindungan otomatis dari XSS, Clickjacking, dan MIME-Sniffing.
6. **Disabled Production Source Maps**: Menjamin kode sumber `.jsx` tidak dapat di-inspect oleh publik melalui browser DevTools.

---

## 📞 5. Kontak & Dukungan Pemeliharaan
Jika terdapat kendala teknis saat proses pengunggahan atau komisioning server, silakan hubungi tim pengembang aplikasi.
