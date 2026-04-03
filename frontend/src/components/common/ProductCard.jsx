import { useTranslation } from 'react-i18next'

const ProductCard = ({ product }) => {
  const { t } = useTranslation()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-[#0071e3]/10 transition-shadow duration-300 group cursor-pointer flex flex-col items-center text-center">
      {product.isNew && (
        <p className="text-[#0071e3] text-[10px] font-bold uppercase tracking-widest mb-1">
          {t('products.new')}
        </p>
      )}
      <h3 className="text-lg font-bold text-[#1d1d1f] mb-1">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-6">{product.tagline}</p>
      
      <div className="relative w-full aspect-square mb-6">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="mt-auto w-full flex justify-between items-center bg-[#f5f5f7] rounded-full p-1 pl-4">
        <span className="text-sm font-semibold text-[#1d1d1f]">{product.price}</span>
        <button className="bg-[#1d1d1f] text-white text-xs font-bold px-4 py-2 rounded-full group-hover:bg-[#0071e3] transition-colors">
          {t('products.buy')}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
