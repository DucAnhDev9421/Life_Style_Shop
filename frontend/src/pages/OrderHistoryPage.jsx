import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingOutlined,
  UserOutlined,
  HeartOutlined,
  ArrowRightOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { orderApi } from '../services/orderApi';
import { getProducts } from '../services/api';
import { Spin, Modal, message, Tag } from 'antd';
import { useTranslation } from 'react-i18next'
import CatalogProductCard from '../components/common/CatalogProductCard';

const OrderHistoryPage = () => {
  const { t } = useTranslation()
  const [orders, setOrders] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const orderRes = await orderApi.getOrders();
      const rawOrders = orderRes.data.data || [];
      const formatted = rawOrders.map(o => {
         let statusText = 'Đang xử lý';
         let statusColor = 'bg-blue-100 text-blue-700';
         let canCancel = o.status === 'pending' || o.status === 'processing';
         
         if (o.status === 'pending') { statusText = 'Chờ xác nhận'; statusColor = 'bg-yellow-100 text-yellow-700'; }
         if (o.status === 'processing') { statusText = 'Đang xử lý'; statusColor = 'bg-blue-100 text-blue-700'; }
         if (o.status === 'shipped') { statusText = 'Đang vận chuyển'; statusColor = 'bg-indigo-500 text-white'; }
         if (o.status === 'delivered') { statusText = 'Đã giao'; statusColor = 'bg-green-100 text-green-700'; }
         if (o.status === 'cancelled') { statusText = 'Đã hủy'; statusColor = 'bg-red-100 text-red-700'; }

         return {
            rawId: o._id,
            id: '#' + o._id.substring(o._id.length - 8).toUpperCase(),
            date: new Date(o.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
            status: statusText,
            total: o.totalAmount.toLocaleString('vi-VN') + ' ₫',
            image: o.items[0]?.product?.thumbnail || o.items[0]?.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80',
            statusColor,
            canCancel,
            items: o.items
         };
      });
      setOrders(formatted);

      // Fetch recommended products
      const prodRes = await getProducts();
      setRecommendedProducts(prodRes.data.items.slice(0, 2));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await orderApi.cancelOrder(orderId);
      message.success('Đã hủy đơn hàng thành công');
      fetchOrders();
    } catch (err) {
      message.error('Không thể hủy đơn hàng');
    }
  };

  const showDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailVisible(true);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col font-['Inter',sans-serif]">
      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-10">
        
        {/* Order History Section */}
        <div className="mb-14">
          <div className="mb-8">
            <h2 className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-2">Account Overview</h2>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Lịch sử đơn hàng</h1>
            <p className="text-gray-500 text-sm max-w-xl">
              Xem lại tất cả các giao dịch và theo dõi trạng thái vận chuyển của các sản phẩm bạn đã chọn từ bộ sưu tập cao cấp của chúng tôi.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào.</p>
              <Link to="/products" className="bg-[#2B5BFF] text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={order.image} alt="Product" className="w-full h-full object-cover mix-blend-multiply drop-shadow-sm" />
                    </div>
                    <div className="flex gap-8 md:gap-14 text-sm w-full">
                      <div className="flex flex-col gap-1 w-32">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Mã đơn hàng</span>
                        <span className="font-bold text-gray-900">{order.id}</span>
                      </div>
                      <div className="flex flex-col gap-1 w-32 hidden sm:flex">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Ngày mua</span>
                        <span className="font-medium text-gray-700">{order.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:gap-14 text-sm w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex flex-col gap-1 w-32">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Trạng thái</span>
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-28">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Tổng tiền</span>
                      <span className="font-bold text-indigo-700">{order.total}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => showDetail(order)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                      >
                        {t('orders.view_detail', 'Chi tiết')}
                      </button>
                      {order.canCancel && (
                        <button 
                          onClick={() => handleCancelOrder(order.rawId)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                        >
                          {t('orders.cancel', 'Hủy')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Section */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-[10px] font-bold text-red-700 tracking-widest uppercase mb-1">Dành riêng cho bạn</h2>
              <h1 className="text-2xl font-bold text-gray-900">Đề xuất dựa trên đơn hàng</h1>
            </div>
            <Link to="#" className="text-blue-600 font-medium text-sm flex items-center hover:underline">
              Xem tất cả <ArrowRightOutlined className="ml-1 text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Big Banner */}
            <div className="md:col-span-2 relative rounded-2xl overflow-hidden min-h-[300px] bg-amber-50 group cursor-pointer block">
              <img 
                src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Banner" 
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center max-w-[60%]">
                <span className="bg-[#B94420] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded w-fit mb-4">Mới về</span>
                <h3 className="text-3xl font-bold text-white mb-3">Bộ sưu tập Thu Đông 2024</h3>
                <p className="text-gray-200 text-sm mb-6 leading-relaxed">
                  Khám phá các thiết kế mới nhất vừa được bổ sung dựa trên phong cách cá nhân của bạn.
                </p>
                <button className="bg-white text-gray-900 px-6 py-2.5 rounded shadow hover:bg-gray-50 transition-colors font-bold w-fit text-sm">
                  Mua ngay
                </button>
              </div>
            </div>

            {recommendedProducts.map(p => (
              <CatalogProductCard key={p._id} product={p} />
            ))}

            {/* Medium Banner */}
            <div className="md:col-span-2 bg-[#E9EDFB] rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row cursor-pointer group">
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative">
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">Có thể bạn thích</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">Túi xách da thủ công</h3>
                <p className="text-gray-600 text-sm mb-6 max-w-[90%]">
                  Được chế tác từ da thật 100%, mang lại vẻ sang trọng bền bỉ.
                </p>
                <div className="text-blue-600 font-medium text-sm flex items-center group-hover:gap-2 transition-all">
                  Khám phá ngay <ArrowRightOutlined className="ml-1 text-xs" />
                </div>
              </div>
              <div className="md:w-5/12 min-h-[220px] bg-[#614130] overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80" 
                  alt="Leather Bag" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.id}`}
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <div className="py-4">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Trạng thái</p>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedOrder.statusColor}`}>
                   {selectedOrder.status}
                 </span>
               </div>
               <div className="text-right">
                 <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Ngày đặt</p>
                 <p className="font-bold text-gray-900">{selectedOrder.date}</p>
               </div>
            </div>

            <div className="space-y-4 mb-8">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <img 
                    src={item.product?.thumbnail || item.product?.images?.[0] || 'https://via.placeholder.com/60'} 
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg bg-white shadow-sm"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product?.name}</h4>
                    <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-600">{item.price.toLocaleString('vi-VN')} ₫</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end p-4 bg-gray-50 rounded-2xl">
              <div className="text-right">
                <span className="text-sm text-gray-500 font-medium">Tổng thanh toán:</span>
                <span className="ml-3 text-2xl font-black text-indigo-700">{selectedOrder.total}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;
