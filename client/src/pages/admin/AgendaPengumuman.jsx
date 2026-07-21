import React from 'react';
import { Icon } from '@iconify/react';

export default function AgendaPengumuman() {
  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#112A46] mb-2">Agenda & Pengumuman</h1>
        <p className="text-slate-500">Kelola jadwal kegiatan dan siaran informasi untuk warga.</p>
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <Icon icon="mdi:calendar-month-outline" className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-[#112A46] mb-2">Kalender Kelurahan</h2>
        <p className="text-slate-500 max-w-md">Fitur kalender interaktif untuk manajemen acara sedang dalam tahap penyempurnaan.</p>
      </div>
    </div>
  );
}