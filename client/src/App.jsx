import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout'; 
import AdminLayout from './layouts/AdminLayout';

import Beranda from './pages/Beranda';
import LaporPengaduan from './pages/LaporPengaduan';
import TanyaLurahUser from './pages/TanyaLurah'; 
import KotakAspirasi from './pages/KotakAspirasi';
import Informasi from './pages/Informasi';
import TanyaPelayanan from './pages/TanyaPelayanan';
import LoginUser from './pages/LoginUser';

import LoginAdmin from './pages/admin/LoginAdmin';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import TanyaLurahAdmin from './pages/admin/TanyaLurah';
import AspirasiWarga from './pages/admin/AspirasiWarga';
import InformasiKelurahan from './pages/admin/InformasiKelurahan';
import AgendaPengumuman from './pages/admin/AgendaPengumuman';
import StatistikLaporan from './pages/admin/StatistikLaporan';
import PengaturanAkun from './pages/admin/PengaturanAkun';
import ManajemenPengguna from './pages/admin/ManajemenPengguna';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login warga disembunyikan - warga tidak perlu login, cukup isi data diri di popup */}
        {/* <Route path="/login" element={<LoginUser />} /> */}
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Beranda />} />
          <Route path="/lapor-pengaduan" element={<LaporPengaduan />} />
          <Route path="/tanya-lurah" element={<TanyaLurahUser />} />
          <Route path="/kotak-aspirasi" element={<KotakAspirasi />} />
          <Route path="/informasi" element={<Informasi />} />
          <Route path="/tanya-pelayanan" element={<TanyaPelayanan />} />
        </Route>

        <Route path="/admin/login" element={<LoginAdmin />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/tanya-lurah" element={<TanyaLurahAdmin />} />
          <Route path="/admin/aspirasi" element={<AspirasiWarga />} />
          <Route path="/admin/informasi" element={<InformasiKelurahan />} />
          <Route path="/admin/agenda" element={<AgendaPengumuman />} />
          <Route path="/admin/statistik" element={<StatistikLaporan />} />
          <Route path="/admin/pengaturan-akun" element={<PengaturanAkun />} />
          <Route path="/admin/manajemen-pengguna" element={<ManajemenPengguna />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;