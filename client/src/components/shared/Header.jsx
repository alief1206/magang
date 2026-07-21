import React from 'react';
import { Link } from 'react-router-dom';
import logoAsli from '../../assets/images/logo-asli.png'; 
import logoBwi from '../../assets/images/logo-banyuwangi.png'; 

export default function Header() {
  return (
    <header className="bg-white shadow-sm w-full sticky top-0 z-50">
      <div className="w-full px-6 lg:px-8 h-20 lg:h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-5 group">
          
          <div className="flex items-center gap-3">
            <img src={logoBwi} alt="Logo Banyuwangi" className="h-12 lg:h-20 w-auto object-contain" />
<img src={logoAsli} alt="Logo ASLI" className="h-12 lg:h-16 w-auto object-contain" />
          </div>
          
          <div className="flex flex-col justify-center border-l-2 border-slate-200 pl-5">
            <h1 className="font-extrabold text-[18px] lg:text-[22px] text-[#112A46] leading-tight group-hover:text-blue-700 transition-colors">
              Kabupaten Banyuwangi
            </h1>
            <p className="text-sm lg:text-[15px] font-medium text-slate-500 flex items-center gap-1.5">
              "Saiki Tandang Bareng"
            </p>
          </div>
          
        </Link>
      </div>
    </header>
  );
}