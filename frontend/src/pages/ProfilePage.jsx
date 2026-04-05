import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { verifyUser } from './../store/authSlice';
import Sidebar from './profile/Sidebar';
import GeneralTab from './profile/GeneralTab';
import SecurityTab from './profile/SecurityTab';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(verifyUser()).unwrap();
      } catch {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      }
    };
    fetchUser();
  }, [dispatch, navigate]);

  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Loader2 className="w-10 h-10 text-[#0071e3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f5f7] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto animate-fade-in-up">
        
        {/* Page Header */}
        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-bold text-[#1d1d1f]">User Profile</h1>
          <p className="mt-2 text-sm text-[#86868b]">
            Manage your personal settings, identity, and security options.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'general' && <GeneralTab user={user} />}
            {activeTab === 'security' && <SecurityTab />}
          </div>

        </div>
      </div>
    </div>
  );
}
