"use client";
import { Menu, Bell, User, Search } from "lucide-react";

export default function ClientHeader({ setMobileOpen }: any) {
  return (
    <header className="h-16 lg:h-20 px-4 lg:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Bouton Hamburger Mobile */}
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-green-700 uppercase">Live Data</span>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><Search size={20} /></button>
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
          A
        </div>
      </div>
    </header>
  );
}