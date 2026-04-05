import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Shield, KeyRound, Save, Loader2 } from 'lucide-react';
import { authApi } from '../../services/authApi';

const passwordSchema = z.object({
  oldPassword: z.string().min(8, "Old password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SecurityTab() {
  const [isChanging, setIsChanging] = useState(false);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsChanging(true);
      await authApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5ea] overflow-hidden animate-fade-in-up">
      <div className="px-6 py-5 border-b border-[#e5e5ea]">
        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#0071e3]" /> Security & Password
        </h3>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="w-5 h-5 text-[#86868b]" />
              </div>
              <input 
                type="password"
                {...register("oldPassword")}
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.oldPassword ? 'border-red-500 bg-red-50' : 'border-[#d2d2d7] bg-[#fbfbfd]'} focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all`}
                placeholder="••••••••"
              />
            </div>
            {errors.oldPassword && <p className="mt-1.5 text-xs text-red-500">{errors.oldPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="w-5 h-5 text-[#86868b]" />
              </div>
              <input 
                type="password"
                {...register("newPassword")}
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.newPassword ? 'border-red-500 bg-red-50' : 'border-[#d2d2d7] bg-[#fbfbfd]'} focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all`}
                placeholder="••••••••"
              />
            </div>
            {errors.newPassword && <p className="mt-1.5 text-xs text-red-500">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="w-5 h-5 text-[#86868b]" />
              </div>
              <input 
                type="password"
                {...register("confirmPassword")}
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-[#d2d2d7] bg-[#fbfbfd]'} focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-6 flex mt-4 border-t border-[#e5e5ea]">
            <button
              type="submit"
              disabled={isChanging}
              className="px-6 py-2.5 rounded-xl bg-white border border-[#0071e3] text-[#0071e3] font-medium text-sm hover:bg-blue-50 focus:ring-4 focus:ring-[#0071e3]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isChanging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
