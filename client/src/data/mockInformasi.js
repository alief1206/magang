export const mockInformasi = [
  {
    id: 1,
    kelurahanId: 1,
    kategori: "Agenda Kegiatan",
    name: "Musyawarah RT",
    headerIcon: "mdi:presentation",
    desc: "Pembahasan Program kerja lingkungan dan rencana bulan Juli",
    date: "Senin, 15 Juli 2026",
    time: "08.00 WIB - Selesai",
    loc: "Balai Kelurahan",
    target: "Terbuka untuk seluruh warga."
  },
  {
    id: 2,
    kelurahanId: 1,
    kategori: "Agenda Kegiatan",
    name: "Rapat Rutinan",
    headerIcon: "mdi:bullhorn",
    desc: "Rapat koordinasi bulanan pengurus kelurahan mengenai evaluasi kinerja staf.",
    date: "Jumat, 20 Juli 2026",
    time: "09.00 WIB - Selesai",
    loc: "Balai Kelurahan",
    target: "Khusus staf dan jajaran RT/RW."
  },
  {
    id: 3,
    kelurahanId: 1,
    kategori: "Pengumuman",
    name: "Bantuan Sosial (Bansos) / Pembagian Sembako",
    headerIcon: "mdi:human-dolly",
    desc: "Pembagian sembako rutin untuk warga yang terdaftar sebagai penerima bantuan.",
    date: "Selasa, 17 Juli 2026",
    time: "09.00 WIB - Selesai",
    loc: "Balai Kelurahan",
    target: "Warga penerima undangan bansos"
  },
  {
    id: 4,
    kelurahanId: 1,
    kategori: "Program Kegiatan",
    name: "Posyandu & Cek Kesehatan",
    headerIcon: "mdi:hospital-box-outline",
    desc: "Pelayanan imunisasi balita serta pemeriksaan tekanan darah gratis untuk lansia.",
    date: "Rabu, 18 Juli 2026",
    time: "07.00 WIB - Selesai",
    loc: "Balai RT / RW",
    target: "Terbuka untuk ibu hamil, balita, dan lansia"
  },
  {
    id: 5,
    kelurahanId: 1,
    kategori: "Program Kegiatan",
    name: "Pembukaan Siskamling Baru",
    headerIcon: "mdi:shield-home-outline",
    desc: "Koordinasi perdana jadwal ronda malam demi meningkatkan keamanan.",
    date: "Jumat, 20 Juli 2026",
    time: "22.00 WIB - Selesai",
    loc: "Pos Ronda Utama",
    target: "Terbuka untuk seluruh warga."
  },
  {
    id: 6,
    kelurahanId: 2,
    kategori: "Agenda Kegiatan",
    name: "Rapat Karang Taruna",
    headerIcon: "mdi:account-group",
    desc: "Rapat pemuda karang taruna kelurahan.",
    date: "Senin, 15 Juli 2026",
    time: "19.00 WIB - Selesai",
    loc: "Balai Kelurahan",
    target: "Pemuda Kelurahan"
  },
  {
    id: 7,
    kelurahanId: 2,
    kategori: "Pengumuman",
    name: "Kerja Bakti Minggu",
    headerIcon: "mdi:broom",
    desc: "Kerja bakti membersihkan lingkungan bersama-sama.",
    date: "Minggu, 21 Juli 2026",
    time: "06.00 WIB - Selesai",
    loc: "Seluruh Lingkungan",
    target: "Seluruh Warga"
  }
];

export const formatInformasiByCategory = (data) => {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = {
        title: item.kategori,
        items: []
      };
    }
    acc[item.kategori].items.push(item);
    return acc;
  }, {});
  return Object.values(grouped);
};
