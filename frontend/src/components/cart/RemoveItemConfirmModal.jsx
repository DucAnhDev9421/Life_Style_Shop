import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'

/**
 * Popup xác nhận khi user bấm "-" lúc số lượng = 1 (sắp về 0 → xóa khỏi giỏ).
 */
function RemoveItemConfirmModal({ open, productTitle, confirming, onCancel, onConfirm }) {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      title={t('cart.remove_confirm_title')}
      okText={t('cart.remove')}
      cancelText={t('cart.cancel')}
      onCancel={onCancel}
      onOk={onConfirm}
      confirmLoading={confirming}
      okButtonProps={{ className: '!rounded-full' }}
      cancelButtonProps={{ className: '!rounded-full' }}
      centered
    >
      <p className="text-gray-600 text-sm leading-relaxed">
        {t('cart.remove_confirm_body', { name: productTitle })}
      </p>
    </Modal>
  )
}

export default RemoveItemConfirmModal
