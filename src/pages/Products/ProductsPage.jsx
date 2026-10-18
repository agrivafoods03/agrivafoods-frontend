import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { Search, SlidersHorizontal, X, RotateCcw, Check, Sparkles } from 'lucide-react';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1000); // Max price filter
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    productService.getProducts()
      .then((data) => {
        setProducts(data || []);
      })
      .catch((err) => {
        console.warn('Failed to load products in ProductsPage:', err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);

  // Compute dynamic category list combining defaults and DB categories
  const categories = useMemo(() => {
    const set = new Set(['All', 'Superfood Powders', 'Immunity', 'Stamina']);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange(1000);
    setMinRating(0);
    setSortBy('featured');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (
          searchTerm.trim() &&
          !p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !(p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        // Category
        if (selectedCategory !== 'All') {
          if (selectedCategory === 'Immunity') {
            if (!p.slug.includes('moringa') && !p.slug.includes('amla') && p.category !== 'Immunity') return false;
          } else if (selectedCategory === 'Stamina') {
            if (!p.slug.includes('beetroot') && p.category !== 'Stamina') return false;
          } else {
            if (p.category !== selectedCategory) return false;
          }
        }

        // Price (check lowest variant price)
        const lowestPrice = Math.min(
          ...(p.variants && p.variants.length > 0 ? p.variants.map((v) => Number(v.price) || 0) : [0])
        );
        if (lowestPrice > priceRange) return false;

        // Rating
        if ((p.rating || 0) < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.variants?.[0]?.price || 0;
        const priceB = b.variants?.[0]?.price || 0;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchTerm, selectedCategory, priceRange, minRating, sortBy]);

  // Sidebar Filter UI
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5">
          Categories
        </h4>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                selectedCategory === cat
                  ? 'bg-primary text-white font-bold'
                  : 'text-foreground hover:bg-[#FBF7F3]'
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Filter */}
      <div className="pt-4 border-t border-sage-light">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Max Starting Price
          </h4>
          <span className="text-xs font-bold text-primary">₹{priceRange}</span>
        </div>
        <input
          type="range"
          min="99"
          max="1000"
          step="50"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-primary h-1.5 bg-sage-light rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted mt-1 font-semibold">
          <span>₹99</span>
          <span>₹1000</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-sage-light">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {[0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`w-full text-left text-xs px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                minRating === rating
                  ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                  : 'text-muted hover:bg-[#FBF7F3]'
              }`}
            >
              <span>{rating === 0 ? 'All Ratings' : `${rating}★ & above`}</span>
              {minRating === rating && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Action */}
      <div className="pt-4 border-t border-sage-light">
        <button
          onClick={handleResetFilters}
          className="w-full py-2 px-3 bg-[#FBF7F3] hover:bg-white border border-sage-light text-muted hover:text-foreground text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Pure Superfoods</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-primary-dark">Shop Our Superfoods</h1>
        <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
          Explore single-ingredient, unadulterated Moringa, Beetroot, and Amla powders. Ethically sourced and packed with potent botanical vitality.
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-sage-light shadow-premium mb-6 sm:mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by powder name, benefits..."
            className="w-full pl-9 pr-4 py-2 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Mobile Filter Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Mobile Filter Drawer Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#FBF7F3] border border-sage-light text-foreground text-xs font-bold rounded-xl flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <span className="text-xs text-muted font-medium whitespace-nowrap hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 bg-white rounded-2xl p-6 border border-sage-light shadow-premium self-start">
          <div className="flex items-center justify-between pb-4 border-b border-sage-light mb-4">
            <h3 className="text-sm font-bold text-foreground">Filter Superfoods</h3>
            <span className="text-xs font-semibold text-muted">
              {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <FilterContent />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="bg-white rounded-2xl border border-sage-light p-20 text-center shadow-premium flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-semibold text-primary-dark">Loading superfoods catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-sage-light p-16 text-center shadow-premium">
              <div className="w-16 h-16 rounded-full bg-[#FBF7F3] border border-sage-light flex items-center justify-center mx-auto mb-4 text-primary">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No products available at this time</h3>
              <p className="text-xs text-muted max-w-sm mx-auto mb-6">
                Our fresh harvest catalog is currently being prepared. Please check back shortly or explore our story.
              </p>
              <Link
                to="/"
                className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors inline-block"
              >
                Return to Home
              </Link>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-sage-light p-12 text-center shadow-premium">
              <p className="text-base font-bold text-foreground mb-1">No matching products found</p>
              <p className="text-xs text-muted mb-6">
                Try clearing your search term or adjusting your selected filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-in Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          <div
            className="fixed inset-0 bg-[#184A35]/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl p-4 sm:p-6 overflow-y-auto z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-sage-light mb-4">
              <h3 className="text-base font-bold text-foreground">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-muted hover:text-foreground rounded-lg"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full mt-6 py-3 bg-primary text-white text-xs font-bold rounded-xl shadow-md min-h-[44px]"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
