import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Selected variant defaults to the first variant or the popular one
  const defaultVariant = (product.variants && product.variants.length > 0)
    ? (product.variants.find((v) => v.isPopular) || product.variants[0])
    : { price: 0, originalPrice: 0, stock: 0, weight: 'Standard' };
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  const inWishlist = isInWishlist(product.id || product._id);
  const isOutOfStock =
    !selectedVariant ||
    (selectedVariant.stock <= 0) ||
    (selectedVariant.inStock === false) ||
    (product.inStock === false) ||
    (product.status === 'draft');

  const discountPercent =
    selectedVariant?.originalPrice && selectedVariant?.price && selectedVariant.originalPrice > selectedVariant.price
      ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, 1, true);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  const handleVariantSelect = (e, variant) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariant(variant);
  };

  return (
    <div className="group bg-white rounded-2xl border border-sage-light overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full relative">
      {/* Top Badges & Wishlist */}
      {isOutOfStock ? (
        <span className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 bg-gray-800 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
          Out of Stock
        </span>
      ) : discountPercent > 0 ? (
        <span className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 bg-accent text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
          Save {discountPercent}%
        </span>
      ) : null}

      <button
        type="button"
        onClick={handleToggleWishlist}
        className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white/85 hover:bg-white text-muted hover:text-error rounded-full shadow-md backdrop-blur-xs transition-colors focus:outline-none"
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`h-4 w-4 sm:h-4.5 sm:w-4.5 transition-colors ${
            inWishlist ? 'fill-red-500 text-red-500' : ''
          }`}
        />
      </button>

      {/* Product Image Area */}
      <Link
        to={`/products/${product.slug}`}
        className="block aspect-square w-full bg-cream/30 p-4 sm:p-6 overflow-hidden flex items-center justify-center relative cursor-pointer"
      >
        <img
          src={selectedVariant?.image || product.images?.[0] || '/assets/moringa-packaging.png'}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover quick-view overlay */}
        <div className="absolute inset-0 bg-primary-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center pointer-events-none">
          <span className="bg-white text-foreground hover:text-primary text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="h-4 w-4" /> Quick View
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-grow">
        {/* Category Label */}
        <span className="text-[9px] sm:text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">
          {product.category}
        </span>

        {/* Product Title */}
        <h3 className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1 mb-1">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Star Rating and Count */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                  i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-foreground">{product.rating || 4.9}</span>
          <span className="text-[11px] sm:text-xs text-muted">({product.reviewCount || 0})</span>
        </div>

        {/* Short Description */}
        <p className="text-[11px] sm:text-xs text-muted line-clamp-2 leading-relaxed mb-3">
          {product.shortDescription || product.description}
        </p>

        {/* Weight Selector Pills */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
          {(product.variants || []).map((v, idx) => {
            const isSelected =
              (selectedVariant?._id && selectedVariant._id === v._id) ||
              (selectedVariant?.sku && selectedVariant.sku === v.sku) ||
              (selectedVariant?.weight === v.weight);
            return (
              <button
                key={v._id || v.sku || v.weight || idx}
                type="button"
                onClick={(e) => handleVariantSelect(e, v)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-[#FBF7F3] text-foreground border-sage-light hover:border-primary/40'
                }`}
              >
                {v.weight}
              </button>
            );
          })}
        </div>

        {/* Bottom Price & Add to Cart Action */}
        <div className="flex items-center justify-between mt-auto pt-2.5 sm:pt-3 border-t border-sage-light/50">
          <div>
            {selectedVariant?.originalPrice > selectedVariant?.price && (
              <span className="text-[11px] sm:text-xs text-muted block line-through -mb-0.5">
                ₹{selectedVariant.originalPrice}
              </span>
            )}
            <span className="text-base sm:text-lg font-extrabold text-primary-dark">
              ₹{selectedVariant?.price || 0}
            </span>
            <span className="text-[9px] sm:text-[10px] text-muted block mt-0.5">
              ({selectedVariant?.weight || 'Standard'})
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`add-to-cart-trigger py-2 px-2.5 sm:p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center gap-1 sm:gap-1.5 focus:outline-none min-h-[38px] sm:min-h-[42px] ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-cream text-primary hover:bg-primary hover:text-white border-primary/20 hover:border-transparent'
            }`}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs font-bold hidden sm:inline">{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
