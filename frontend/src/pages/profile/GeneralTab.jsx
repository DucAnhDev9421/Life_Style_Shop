import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { User, Phone, Image, Mail, Save, Loader2 } from 'lucide-react'
import { authApi } from '../../services/authApi'

const generalSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(50, "Full name is too long"),
  phone: z.string().regex(/^\d{10,11}$/, "Phone number must be 10-11 digits").optional().or(z.literal('')),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
})

export default function GeneralTab({ user, onUpdate }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      avatarUrl: user?.avatarUrl || '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    try {
      const result = await authApi.updateProfile(data)
      toast.success('General profile updated successfully')
      reset(data)
      if (onUpdate) onUpdate(result.data.user)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5ea] overflow-hidden animate-fade-in-up">
      <div className="px-6 py-5 border-b border-[#e5e5ea]">
        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
          <User className="w-5 h-5 text-[#0071e3]" /> General Information
        </h3>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#86868b]" />
                </div>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#e5e5ea] bg-[#f5f5f7] text-[#86868b] focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-[#86868b]" />
                </div>
                <input
                  {...register('fullName')}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-[#d2d2d7] bg-[#fbfbfd]'} focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-[#86868b]" />
                </div>
                <input
                  {...register('phone')}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-[#d2d2d7] bg-[#fbfbfd]'} focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all`}
                  placeholder="1234567890"
                />
              </div>
              {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">Avatar URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image className="w-5 h-5 text-[#86868b]" />
                </div>
                <input
                  {...register('avatarUrl')}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.avatarUrl ? 'border-red-500 bg-red-50' : 'border-[#d2d2d7] bg-[#fbfbfd]'} focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all`}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              {errors.avatarUrl && <p className="mt-1.5 text-xs text-red-500">{errors.avatarUrl.message}</p>}
            </div>
          </div>

          <div className="pt-6 flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="px-6 py-2.5 rounded-xl bg-[#0071e3] text-white font-medium text-sm hover:bg-[#0077ED] focus:ring-4 focus:ring-[#0071e3]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(0,113,227,0.39)]"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
