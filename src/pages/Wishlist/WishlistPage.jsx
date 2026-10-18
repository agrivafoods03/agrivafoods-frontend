import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService.getProducts()
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => {
        console.warn('Failed to load wishlist products:', err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const wishlistProducts = products.filter(
    (p) => wishlist.includes(p.id) || wishlist.includes(p._id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-primary-dark">My Wishlist</h1>
        <p className="text-xs text-muted mt-1">
          Keep track of superfood powders you want to bring into your routine.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="max-w-md mx-auto py-16 px-4 bg-white rounded-3xl border border-sage-light shadow-premium text-center">
          <div className="w-16 h-16 rounded-full bg-[#FBF7F3] border border-sage-light flex items-center justify-center mx-auto mb-4 text-muted">
            <Heart className="w-8 h-8 stroke-[1.2]" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">Your wishlist is empty</h2>
          <p className="text-xs text-muted mb-6">
            Explore our collection of natural superfood powders and save your favorites here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
