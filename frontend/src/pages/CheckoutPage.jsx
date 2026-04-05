import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { message, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/useCart'
import ShippingForm from '../components/checkout/ShippingForm'
import PaymentMethod from '../components/checkout/PaymentMethod'
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary'
import { validateCheckoutShipping } from '../utils/checkoutValidation'
import { buildOrderPayload, createOrder } from '../services/orderApi'

/**
 * Mã giảm giá demo — sau này thay bằng GET/POST /coupons/validate trên server.
 * LIFESTYLE10: giảm 10% tạm tính (làm tròn xuống).
 * SAVE50K: giảm cố định 50.000 VNĐ (không vượt tạm tính).
 */
const DEMO_COUPONS = {
  LIFESTYLE10: { type: 'percent', value: 10 },
  SAVE50K: { type: 'fixed', value: 50_000 },
}

function computeDiscountVnd(codeUpper, subtotalVnd) {
  const rule = DEMO_COUPONS[codeUpper]
  if (!rule) return null
  let d =
    rule.type === 'percent'
      ? Math.floor((subtotalVnd * rule.value) / 100)
      : rule.value
  d = Math.min(Math.max(0, d), subtotalVnd)
  return d
}

function CheckoutPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    lines,
    loading,
    subtotalVnd,
    shippingVnd,
    clearCart,
  } = useCart()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  })
  const [errors, setErrors] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [couponDraft, setCouponDraft] = useState('')
  const [couponErrorKey, setCouponErrorKey] = useState(null)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  /** Giảm giá hiển thị luôn capped theo tạm tính hiện tại (nếu giỏ thay đổi). */
  const discountVnd = useMemo(() => {
    if (!appliedCoupon) return 0
    return Math.min(appliedCoupon.discountVnd, subtotalVnd)
  }, [appliedCoupon, subtotalVnd])

  const totalVnd = Math.max(0, subtotalVnd - discountVnd + shippingVnd)

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  /**
   * Áp dụng mã: kiểm tra DEMO_COUPONS → set state giảm giá + toast thành công;
   * mã sai → lỗi đỏ dưới ô + toast không bắt buộc (chỉ message dưới ô).
   */
  const handleApplyCoupon = () => {
    const raw = couponDraft.trim().toUpperCase()
    if (!raw) {
      setCouponErrorKey('checkout.coupon_empty')
      setAppliedCoupon(null)
      return
    }
    const d = computeDiscountVnd(raw, subtotalVnd)
    if (d === null) {
      setCouponErrorKey('checkout.coupon_invalid')
      setAppliedCoupon(null)
      return
    }
    setAppliedCoupon({ code: raw, discountVnd: d })
    setCouponErrorKey(null)
    message.success(t('checkout.coupon_success'))
  }

  /**
   * Submit: validate form → đóng gói payload (form + giỏ + pricing) → POST /orders.
   * Thành công: toast, clearCart, về trang chủ. Lỗi mạng/server: toast lỗi.
   */
  const handleCheckout = async () => {
    const nextErrors = validateCheckoutShipping(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      message.warning(t('checkout.validation_fix'))
      return
    }
    if (!lines.length) {
      message.warning(t('checkout.validation_empty_cart'))
      return
    }

    const payload = buildOrderPayload({
      customer: form,
      paymentMethod,
      items: lines,
      pricing: {
        subtotalVnd,
        discountVnd,
        shippingVnd,
        totalVnd,
      },
      couponCode: appliedCoupon?.code ?? null,
    })

    setSubmitting(true)
    try {
      await createOrder(payload)
      message.success(t('checkout.order_success'))
      clearCart()
      navigate('/')
    } catch (err) {
      console.error('[checkout] createOrder failed', err)
      message.error(t('checkout.order_error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#fbfbfd] min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-3 py-24">
        <Spin size="large" />
        <p className="text-gray-500 text-sm">{t('checkout.loading')}</p>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="bg-[#fbfbfd] min-h-[calc(100vh-4rem)] px-4 sm:px-8 py-12">
        <div className="max-w-lg mx-auto text-center rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
          <p className="text-gray-600 mb-6">{t('checkout.empty_cart')}</p>
          <Link
            to="/cart"
            className="inline-flex rounded-full bg-[#0071e3] text-white text-sm font-bold px-8 py-3 hover:opacity-90 no-underline"
          >
            {t('checkout.back_to_cart')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#fbfbfd] min-h-[calc(100vh-4rem)] pb-16 pt-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <nav className="text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#0071e3]">
            {t('productDetail.breadcrumb_home')}
          </Link>
          <span className="mx-2">/</span>
          <Link to="/cart" className="hover:text-[#0071e3]">
            {t('cart.title')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1d1d1f] font-medium">{t('checkout.title')}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight mb-8">
          {t('checkout.title')}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 lg:items-start">
          <div className="flex-1 min-w-0 space-y-6">
            <ShippingForm
              values={form}
              errors={errors}
              onFieldChange={handleFieldChange}
            />
            <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
          </div>

          <CheckoutOrderSummary
            lines={lines}
            subtotalVnd={subtotalVnd}
            discountVnd={discountVnd}
            shippingVnd={shippingVnd}
            totalVnd={totalVnd}
            couponDraft={couponDraft}
            onCouponDraftChange={(v) => {
              setCouponDraft(v)
              if (couponErrorKey) setCouponErrorKey(null)
            }}
            onApplyCoupon={handleApplyCoupon}
            couponErrorKey={couponErrorKey}
            appliedCouponCode={appliedCoupon?.code ?? null}
            onSubmit={handleCheckout}
            submitting={submitting}
            disabledSubmit={submitting}
          />
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
