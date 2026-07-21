import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

export default function MainLayout() {
  const location = useLocation();
  
  const chatPages = ['/tanya-lurah', '/konsultasi-lurah', '/tanya-pelayanan']; 
  const isChatPage = chatPages.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isChatPage && <Header />}
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {!isChatPage && <Footer />}
      
    </div>
  );
}