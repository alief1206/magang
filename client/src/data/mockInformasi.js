const templateItems = [
  {
    kategori: "Agenda Kegiatan",
    name: "Musyawarah RT",
    headerIcon: "mdi:presentation",
    desc: "Pembahasan Program kerja lingkungan dan rencana kegiatan bulan ini.",
    date: "Senin, 15 Juli 2026",
    time: "08.00 WIB - Selesai",
    loc: "Balai Kelurahan",
    target: "Terbuka untuk seluruh warga."
  },
  {
    kategori: "Agenda Kegiatan",
    name: "Rapat Rutinan Pengurus",
    headerIcon: "mdi:bullhorn",
    desc: "Rapat koordinasi bulanan pengurus kelurahan mengenai evaluasi kinerja dan pelayanan publik.",
    date: "Jumat, 20 Juli 2026",
    time: "09.00 WIB - Selesai",
    loc: "Balai Kelurahan",
    target: "Khusus staf dan jajaran RT/RW."
  },
  {
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
    kategori: "Program Kegiatan",
    name: "Posyandu & Cek Kesehatan Lansia",
    headerIcon: "mdi:hospital-box-outline",
    desc: "Pelayanan imunisasi balita serta pemeriksaan tekanan darah dan gula darah gratis.",
    date: "Rabu, 18 Juli 2026",
    time: "07.00 WIB - Selesai",
    loc: "Balai RT / RW",
    target: "Terbuka untuk ibu hamil, balita, dan lansia"
  },
  {
    kategori: "Program Kegiatan",
    name: "Pembukaan Siskamling Baru",
    headerIcon: "mdi:shield-home-outline",
    desc: "Koordinasi perdana jadwal ronda malam demi meningkatkan keamanan lingkungan.",
    date: "Jumat, 20 Juli 2026",
    time: "22.00 WIB - Selesai",
    loc: "Pos Ronda Utama",
    target: "Terbuka untuk seluruh warga."
  }
];

// Generate mock data for kelurahan IDs 1 to 20
export const mockInformasi = Array.from({ length: 20 }, (_, index) => {
  const kelurahanId = index + 1;
  return templateItems.map((item, itemIdx) => ({
    id: kelurahanId * 10 + itemIdx + 1,
    kelurahanId: kelurahanId,
    ...item
  }));
}).flat();

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
