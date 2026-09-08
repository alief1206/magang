import React, { useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import logoAsli from '../../assets/images/logo-asli.png'; 
import logoBwi from '../../assets/images/logo-banyuwangi.png'; 

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const clickTimeout = useRef(null);

  const handleTextClick = (e) => {
    e.preventDefault();
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      navigate('/admin/login');
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
        navigate('/');
      }, 250); 
    }
  };

  const isHome = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm w-full sticky top-0 z-50">
      <div className="w-full px-6 lg:px-8 h-20 lg:h-24 flex items-center justify-between">
        
        <div className="flex items-center gap-5">
          {!isHome && (
            <button 
              onClick={() => navigate(-1)} 
              className="mr-2 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 flex items-center justify-center"
              title="Kembali"
            >
              <Icon icon="mdi:arrow-left" className="w-6 h-6" />
            </button>
          )}

          <div className="flex items-center gap-5 group">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoBwi} alt="Logo Banyuwangi" className="h-12 lg:h-20 w-auto object-contain" />
              <img src={logoAsli} alt="Logo ASLI" className="h-12 lg:h-16 w-auto object-contain" />
            </Link>
            
            <div 
              onClick={handleTextClick}
              className="flex flex-col justify-center border-l-2 border-slate-200 pl-5 cursor-pointer select-none"
            >
              <h1 className="font-extrabold text-[18px] lg:text-[22px] text-[#112A46] leading-tight group-hover:text-blue-700 transition-colors">
                Kabupaten Banyuwangi
              </h1>
              <p className="text-sm lg:text-[15px] font-medium text-slate-500 flex items-center gap-1.5">
                "Saiki Tandang Bareng"
              </p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}