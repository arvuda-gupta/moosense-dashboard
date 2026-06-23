import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <TopNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
