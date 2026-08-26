const MENU_UTAMA = `*Menu Utama*
(Sistem Pelayanan Online Kelurahan)

Silakan pilih layanan yang dibutuhkan dg ketik huruf A/ B/ C/ D/ E, untuk layanan sbb :
A : Layanan Administrasi
B : Informasi Nomor Telepon
C : Informasi Lokasi Kantor
D : Agenda Kelurahan
E : Call center & Pengaduan

_contoh :_
*A* _(untuk memilih layanan administrasi)_`;

const MENU_A = `*Layanan Administrasi*
1 : Kartu Tanda Penduduk (KTP)/ Pemula/ Perubahan/ Kehilangan
2 : Kartu Keluarga (KK)
3 : Pendaftaran Penduduk Pindah Datang (WNI)
4 : Pendaftaran Penduduk Pindah Keluar (WNI)
5 : Surat Keterangan Bepergian
6 : Pendaftaran Kelahiran/ Keterangan Kelahiran
7 : Pencatatan lahir mati/ Pendaftaran Kematian/ Keterangan Kematian
8 : Surat Pengantar Permohonan Rekomendasi Ijin Keramaian
9 : Surat Pernyataan Miskin (SPM)
10 : Surat Keterangan Tidak Mampu (SKTM)
11 : Surat Keterangan Belum Menikah (SKBM)
12 : Surat Keterangan Usaha
13 : Surat Keterangan Pendaftaran Pernikahan
14 : Surat Keterangan Domisili Usaha/ Perusahaan/ Penduduk Sementara
15 : Surat Keterangan Taksiran Harga Tanah
16 : Surat Keterangan/ Pernyataan Waris
17 : Surat Kuasa
18 : Permohonan Tandatangan Mengetahui/ Legalisir
19 : Surat keterangan Lainnya.

_contoh :_
*2* (untuk mengurus Kartu Keluarga)

Balas dengan ketik *NOMOR* layanan yg dibutuhkan atau *AA* untuk kembali ke menu utama.`;

const MENU_B = `*Informasi Nomor Telepon*
Call Center Pemkab (Bebas Pulsa): 112 
PUSDALOP BPBD: 08113439800
Pemadam Kebakaran (DAMKAR): +62333422113
IGD RSUD: +62333421118

Balas *AA* untuk kembali ke menu utama.`;

const MENU_C = `*Informasi Lokasi Kantor*
Kantor Kelurahan buka pada hari dan jam kerja. Silakan datang langsung ke loket pelayanan kelurahan setempat.

Balas *AA* untuk kembali ke menu utama.`;

const MENU_D = `*Agenda Kelurahan*
Mohon maaf belum ada agenda kegiatan khusus saat ini.

Balas *AA* untuk kembali ke menu utama.`;

const MENU_E = `*Call center & Pengaduan*
Silahkan kirim pertanyaan/ saran/ kritik, akan dijawab oleh *Petugas Kelurahan pada Jam Kerja.*

_Jam Kerja_
*Senin s.d Kamis* 08.00 - 15.00
*Jum'at* 07.30 - 15.00

Balas *AA* untuk kembali ke menu utama.`;

const SYARAT = {
  '1': `*Persyaratan Kartu Tanda Penduduk (KTP)/ Pemula/ Perubahan/ Kehilangan*
1. Surat Pengantar dari Ketua RT diketahui RW
2. KTP Asli (utk perpanjangan) & FC
3. KK Asli & FC
4. Surat Laporan kehilangan dari Polri apabila KTP Asli Hilang.
5. Pas Foto 3x4 Cm 2 lembar
6. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '2': `*Persyaratan Kartu Keluarga (KK)*
1. Surat Pengantar dari Ketua RT diketahui RW
2. KK Asli & FC
3. Surat Laporan kehilangan dari Polri apabila KK Asli Hilang.
4. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '3': `*Persyaratan Pendaftaran Penduduk Pindah Datang (WNI)*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC
3. Surat Pindah dari tempat asal dan lampirannya
4. Bukti Bukti Lunas PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '4': `*Persyaratan Pendaftaran Penduduk Pindah Keluar (WNI)*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC
3. SKCK (pindah luar Kecamatan/ Kabupaten)
4. Bukti Bukti Lunas PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '5': `*Persyaratan Surat Keterangan Bepergian*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC
3. Pas Foto 3x4 Cm 2 lembar
4. Surat Persetujuan Keluarga (Orang tua/ Suami/ Isteri)
5. Bukti Pelunasan PBB.

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '6': `*Persyaratan Pendaftaran Kelahiran/ Surat Keterangan Kelahiran*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC
3. Surat Nikah/ Akta Perkawinan
4. Keterangan kelahiran dari RS/ Klinik/ Bidan tempat persalinan
5. Bukti Pelunasan PBB.

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '7': `*Persyaratan Pencatatan lahir mati/ Pendaftaran Kematian/ Keterangan Kematian*
1. Surat Pengantar Ketua RT diketahui RW
2. Pernyataan meninggal dari ahli waris disaksikan Ketua RT & RW
3. KK dan KTP Asli & FC yang meninggal
4. FC KTP 2 Orang saksi
5. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '8': `*Persyaratan Surat Pengantar Permohonan Rekomendasi Ijin Keramaian*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli pemohon dan FC
3. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '9': `*Persyaratan Surat Pernyataan Miskin (SPM)*
1. Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli pemohon dan FC
3. Pernyataan tertulis dari pemohon
4. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '10': `*Persyaratan Surat Keterangan Tidak Mampu (SKTM)*
1. Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli pemohon dan FC
3. Bukti Bukti Lunas PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '11': `*Persyaratan Surat Keterangan Belum Menikah (SKBM)*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC
3. Pernyataan Belum Menikah (bermaterai)
4. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '12': `*Persyaratan Surat Keterangan Usaha*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC
3. Bukti Kepemilikan usaha/ perusahaan (FC ijin usaha / Foto Usaha)
4. Bukti Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '13': `*Persyaratan Surat Keterangan Pendaftaran Pernikahan*
1. Surat Pengantar RT / RW
2. Persetujuan Orang Tua bagi Pria Berumur Min 19 tahun, Wanita berumur 16 tahun
3. KTP dan KK Asli & FC
4. Ijazah/ akte Kelahiran
5. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '14': `*Persyaratan Surat Keterangan Domisili Usaha/ Perusahaan/ Penduduk Sementara*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC
3. Bukti Kepemilikan usaha/ perusahaan / tempat tinggal
4. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '15': `*Persyaratan Surat Keterangan Taksiran Harga Tanah*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC
3. Bukti Kepemilikan Tanah
4. SPPT dan Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '16': `*Persyaratan Surat Keterangan/ Pernyataan Waris*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC Ahli Waris
3. Silsilah Keluarga Ahli Waris
4. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '17': `*Persyaratan Surat Kuasa*
1. Surat Pengantar Ketua RT diketahui RW
2. KK dan KTP Asli & FC masing-masing pihak
3. Materai
4. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '18': `*Persyaratan Permohonan Tandatangan Mengetahui/ Legalisir*
1. Dokumen Asli yang akan dilegalisir
2. Fotokopi dokumen yang akan dilegalisir
3. KTP Asli & FC pemohon

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,

  '19': `*Persyaratan Surat keterangan Lainnya*
1. Surat Pengantar RT/ RW
2. KK dan KTP Asli & FC
3. Dokumen pendukung
4. Bukti Pelunasan PBB

*_Jika berkas sudah lengkap silahkan ketik angka 0_*
Kembali ke menu utama ketik *AA*, atau membatalkan layanan dengan ketik *batal*`,
}

function normalizeMessage(message) {
  return String(message || '')
    .trim()
    .toLowerCase()
}

function generateReply(message) {
  const text = normalizeMessage(message)

  if (!text) {
    return 'Pesan belum boleh kosong.'
  }

  // Kembali ke menu utama
  if (text === 'aa' || text === 'menu') {
    return MENU_UTAMA
  }

  // Menu Layanan
  if (text === 'a') return MENU_A
  if (text === 'b') return MENU_B
  if (text === 'c') return MENU_C
  if (text === 'd') return MENU_D
  if (text === 'e') return MENU_E

  // Submenu Syarat Layanan Administrasi (1 - 15)
  if (SYARAT[text]) {
    return SYARAT[text]
  }

  // Selesai pengisian / batal
  if (text === '0') {
    return 'Terima kasih, dokumen akan segera diproses. Silakan tunggu informasi selanjutnya dari petugas.\n\nKetik *AA* untuk kembali ke menu utama.'
  }
  if (text === 'batal') {
    return 'Terima kasih sudah menggunakan Layanan Kelurahan.\n\nKetik *AA* untuk kembali ke menu utama.'
  }

  // Keyword umum / Default Response
  const greetings = ['halo', 'hai', 'hello', 'hi', 'p', 'assalamualaikum', 'ping']
  if (greetings.includes(text)) {
    return MENU_UTAMA
  }

  const thanks = ['terima kasih', 'makasih', 'thanks', 'suwun', 'maturnuwun']
  if (thanks.includes(text)) {
    return 'Sama-sama! Senang bisa membantu.\nKetik *AA* jika butuh layanan lainnya.'
  }

  // Fallback (jika text di luar keyword, arahkan ke menu utama atau sampaikan pesan tak dikenali)
  return 'Maaf, sistem autoreply belum memahami format pesan Anda.\n\nSilakan ketik *AA* untuk melihat Menu Utama atau ketik *E* untuk mengirim pertanyaan/pengaduan langsung ke petugas.'
}

module.exports = {
  generateReply,
}
