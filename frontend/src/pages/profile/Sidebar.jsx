import React from 'react';
import { UserRound, ShieldCheck } from 'lucide-react';

export default function Sidebar({ user, activeTab, setActiveTab }) {
  return (
    <div className="w-full md:w-[280px] flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5ea] overflow-hidden sticky top-24">
        <div className="p-6 text-center border-b border-[#e5e5ea]">
          <img 
            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0071e3&color=fff`}
            alt="Avatar" 
            className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
          />
          <h2 className="mt-4 text-xl font-semibold text-[#1d1d1f] truncate px-2">{user?.fullName || 'User'}</h2>
          <span className="inline-flex items-center justify-center mt-2 px-3 py-1 rounded-full bg-blue-50 text-[#0071e3] text-[10px] font-bold uppercase tracking-wider">
            {user?.role || 'Customer'}
          </span>
        </div>
        
        <nav className="p-3 space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'general' 
                ? 'bg-[#0071e3]/10 text-[#0071e3]' 
                : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
            }`}
          >
            <UserRound className={`w-5 h-5 ${activeTab === 'general' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
            General Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'security' 
                ? 'bg-[#0071e3]/10 text-[#0071e3]' 
                : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${activeTab === 'security' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
            Security & Password
          </button>
        </nav>
      </div>
    </div>
  );
}
