import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockReviews } from '../../data/mockReviews';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { resolveMediaUrl } from '../../utils/mediaUtils';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Package,
  Plus,
  Minus
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    productService.getProductBySlug(slug)
      .then((data) => {
        if (isMounted && data) {
          setProduct(data);
          const defaultVar = data.variants?.find((v) => v.isPopular) || data.variants?.[0];
          setSelectedVariant(defaultVar);
          setQuantity(1);
          setActiveImageIndex(0);
        } else if (isMounted) {
          setProduct(null);
        }
      })
      .catch((err) => {
        console.warn('API getProductBySlug error:', err);
        if (isMounted) setProduct(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
        window.scrollTo(0, 0);
      });

    // Dynamically fetch other published products for related section
    productService.getProducts()
      .then((allProducts) => {
        if (isMounted && Array.isArray(allProducts)) {
          setRelatedProducts(
            allProducts.filter((p) => p.slug !== slug).slice(0, 3)
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading && !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-primary-dark font-medium">Loading superfood powder details...</p>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h2>
        <p className="text-sm text-muted mb-6">
          We couldn't locate the superfood powder you requested.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const isVariantOutOfStock =
    (selectedVariant.stock <= 0) ||
    (selectedVariant.inStock === false) ||
    (product.inStock === false) ||
    (product.status === 'draft');

  const discountPercent = Math.round(
    ((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100
  );

  const displayImage = resolveMediaUrl(selectedVariant.image || product.images[activeImageIndex] || product.images[0]);

  const handleAddToCart = () => {
    if (isVariantOutOfStock) return;
    addToCart(product, selectedVariant, quantity, true);
  };

  const handleBuyNow = () => {
    if (isVariantOutOfStock) return;
    addToCart(product, selectedVariant, quantity, false);
    navigate('/checkout');
  };

  const productReviews = mockReviews.filter(
    (r) => r.productId === product.id || r.productName.toLowerCase().includes(product.slug.split('-')[0])
  );


  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-medium text-muted mb-4 sm:mb-6">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-sage" />
        <Link to="/products" className="hover:text-primary transition-colors">
          Superfoods
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-sage" />
        <span className="text-foreground font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-sage-light shadow-premium mb-8 sm:mb-12">
        {/* Left Side: Product Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-4">
          <div className="relative bg-[#FBF7F3] rounded-2xl p-4 sm:p-8 border border-sage-light flex items-center justify-center min-h-[260px] xs:min-h-[320px] sm:min-h-[480px] overflow-hidden">
            {isVariantOutOfStock ? (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-gray-800 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-sm z-10">
                Out of Stock
              </span>
            ) : discountPercent > 0 ? (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-accent text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-sm z-10">
                Save {discountPercent}%
              </span>
            ) : null}
            <img
              src={displayImage}
              alt={product.name}
              className="max-h-[240px] xs:max-h-[300px] sm:max-h-[460px] w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-500 rounded-lg"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl bg-[#FBF7F3] p-1.5 border transition-all overflow-hidden flex items-center justify-center ${
                    activeImageIndex === idx
                      ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                      : 'border-sage-light opacity-75 hover:opacity-100 hover:border-primary/50'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={resolveMediaUrl(img)} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Buy Box */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase rounded-full">
                {product.category}
              </span>
              <span className="text-[11px] text-muted font-medium">SKU: {selectedVariant.sku}</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-primary-dark tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs text-primary font-bold mt-1">{product.tagline}</p>

            {/* Ratings */}
            <div className="flex items-center gap-2 sm:gap-3 mt-2.5">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 stroke-amber-400" />
                ))}
                <span className="text-xs font-bold text-foreground ml-1.5">{product.rating}</span>
              </div>
              <span className="text-[11px] sm:text-xs text-muted">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Price Area */}
          <div className="p-3.5 sm:p-4 bg-[#FBF7F3] rounded-2xl border border-sage-light/80 flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-2.5">
              <span className="text-xl sm:text-3xl font-black text-primary-dark">
                ₹{selectedVariant.price}
              </span>
              {selectedVariant.originalPrice > selectedVariant.price && (
                <span className="text-xs sm:text-sm text-muted line-through font-semibold">
                  ₹{selectedVariant.originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[11px] sm:text-xs font-bold text-accent">({discountPercent}% OFF)</span>
              )}
            </div>
            {isVariantOutOfStock ? (
              <span className="text-[11px] sm:text-xs font-semibold text-red-700 bg-red-100/70 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md">
                Out of Stock
              </span>
            ) : (
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md">
                In Stock ({selectedVariant.stock} available)
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selection */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-foreground">Select Package Size / Weight</div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-transparent shadow-premium scale-[1.02]'
                        : 'bg-white border-sage hover:bg-cream text-muted'
                    }`}
                  >
                    {v.weight} -{' '}
                    <span className={isSelected ? 'text-white/95' : 'text-primary-dark font-bold'}>
                      ₹{v.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to Cart + Buy Now + Wishlist Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-sage rounded-xl bg-cream/30 overflow-hidden h-11 sm:h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 sm:px-4 h-full text-muted hover:text-foreground hover:bg-cream transition-colors flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-3 sm:px-4 font-bold text-sm text-foreground min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3.5 sm:px-4 h-full text-muted hover:text-foreground hover:bg-cream transition-colors flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id, product.name)}
                className={`p-3 border border-sage rounded-xl hover:bg-cream transition-colors h-11 sm:h-12 w-11 sm:w-12 flex items-center justify-center focus:outline-none flex-shrink-0 ${
                  inWishlist ? 'text-error bg-error/5 border-error/20' : 'text-muted'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-error' : ''}`} />
              </button>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isVariantOutOfStock}
                className={`font-bold text-xs sm:text-sm px-2 sm:px-4 min-h-[44px] h-11 sm:h-12 rounded-xl border flex items-center justify-center gap-1.5 focus:outline-none transition-colors ${
                  isVariantOutOfStock
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white hover:bg-cream text-primary border-primary/20'
                }`}
              >
                <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{isVariantOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isVariantOutOfStock}
                className={`font-bold text-xs sm:text-sm px-2 sm:px-4 min-h-[44px] h-11 sm:h-12 rounded-xl transition-all duration-300 flex items-center justify-center truncate ${
                  isVariantOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white shadow-premium hover:shadow-premium-hover'
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Shipping and stock notice */}
          <div className="bg-cream/20 border border-sage-light rounded-xl p-3.5 sm:p-4 flex flex-col gap-2 mt-2 text-xs text-muted">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span>In stock and ready to ship</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Free standard delivery on orders above ₹499</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs Section */}
      <section className="border-t border-sage-light/60 pt-8 sm:pt-12 mb-12 sm:mb-16">
        <div className="flex border-b border-sage-light overflow-x-auto no-scrollbar gap-4 sm:gap-8 pb-px">
          {[
            { id: 'benefits', label: 'Key Benefits' },
            { id: 'usage', label: 'Ingredients & How to Use' },
            { id: 'nutrition', label: 'Nutritional Value' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 sm:pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap focus:outline-none border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-extrabold'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8 min-h-[250px]">
          {activeTab === 'benefits' && (
            <div className="max-w-3xl animate-fade-in space-y-4">
              <h3 className="text-lg font-bold text-primary-dark mb-4">
                Healthy Benefits of {product.name}
              </h3>
              <ul className="flex flex-col gap-3">
                {product.benefits?.map((benefit, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-foreground/80">
                    <CheckCircle2 className="h-4.5 w-4.5 text-accent mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary-dark mb-2">Ingredients</h3>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {product.ingredients?.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-bold text-primary-dark pt-4 mb-2">How to Use</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed bg-[#FBF7F3] p-4 rounded-xl border border-sage-light">
                  {product.usageInstructions}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary-dark mb-2">Storage & Shelf Life</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed bg-[#FBF7F3] p-4 rounded-xl border border-sage-light">
                  {product.storageInstructions}
                </p>
                <div className="text-xs font-semibold text-foreground pt-1">
                  Shelf Life: <span className="text-primary font-bold">{product.shelfLife}</span> from packaging date.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="max-w-xl animate-fade-in space-y-4">
              <h3 className="text-lg font-bold text-primary-dark mb-3">
                Nutritional Information (per 100g)
              </h3>
              <div className="bg-[#FBF7F3] rounded-2xl border border-sage-light divide-y divide-sage-light/60 overflow-hidden text-xs sm:text-sm">
                {Object.entries(product.nutrition || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2.5 px-5">
                    <span className="text-muted font-medium">{key}</span>
                    <span className="text-foreground font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews for this product */}
      {productReviews.length > 0 && (
        <section className="border-t border-sage-light/60 pt-12 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-primary-dark">Customer Reviews</h2>
              <p className="text-xs text-muted">What verified buyers say about {product.name}</p>
            </div>
            <Link to="/reviews" className="text-xs font-bold text-primary hover:underline">
              View All Reviews →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productReviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-white rounded-2xl border border-sage-light shadow-premium">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted">{rev.date}</span>
                </div>
                <h4 className="text-xs font-bold text-foreground mb-1">"{rev.title}"</h4>
                <p className="text-xs text-muted leading-relaxed mb-3">{rev.comment}</p>
                <div className="text-[10px] font-semibold text-primary">
                  {rev.name} • {rev.location} (Verified Buyer)
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-sage-light/60 pt-12">
          <h2 className="text-xl sm:text-2xl font-black text-primary-dark mb-6">
            Complementary Superfoods
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
