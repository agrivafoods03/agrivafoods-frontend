import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Search, X, ArrowRight, Star } from 'lucide-react';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      productService.getProducts()
        .then((data) => {
          if (Array.isArray(data)) setProducts(data);
        })
        .catch((err) => console.warn('Failed to load products in SearchModal:', err));
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const matched = products.filter((product) => {
      const matchName = (product.name || '').toLowerCase().includes(q);
      const matchCategory = (product.category || '').toLowerCase().includes(q);
      const matchDesc = (product.description || '').toLowerCase().includes(q);
      const matchBenefits = product.benefits?.some((b) => b.toLowerCase().includes(q));
      return matchName || matchCategory || matchDesc || matchBenefits;
    });

    setResults(matched);
  }, [query, products]);

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4 bg-[#184A35]/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-sage-light overflow-hidden animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-sage-light bg-[#FBF7F3]">
          <Search className="w-5 h-5 text-muted mr-2.5 sm:mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Moringa, Beetroot, Amla..."
            className="w-full bg-transparent text-foreground placeholder:text-muted/60 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-muted hover:text-foreground mr-1"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-muted hover:text-foreground bg-white border border-sage-light rounded-lg transition-colors ml-1.5 sm:ml-2"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[65vh] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-4">
          {query.trim() === '' ? (
            <div className="py-6 sm:py-8 text-center">
              <p className="text-xs font-bold tracking-wider uppercase text-muted mb-3">Popular Searches</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {['Moringa Powder', 'Beetroot Powder', 'Amla Powder', 'Pre-workout', 'Vitamin C'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#FBF7F3] hover:bg-sage-light text-foreground text-xs font-medium rounded-full border border-sage-light transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2 sm:space-y-2.5">
              <p className="text-xs font-medium text-muted px-1">
                Found {results.length} product{results.length > 1 ? 's' : ''}
              </p>
              {results.map((product) => (
                <div
                  key={product.id || product._id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-[#FBF7F3] border border-transparent hover:border-sage-light transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-cream flex items-center justify-center p-1 border border-sage-light overflow-hidden flex-shrink-0">
                      <img
                        src={product.images?.[0] || '/assets/moringa-packaging.png'}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-muted line-clamp-1">{product.shortDescription || product.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {product.variants?.[0]?.price && (
                          <span className="text-xs font-bold text-primary">₹{product.variants[0].price}</span>
                        )}
                        {product.variants?.[0]?.originalPrice > product.variants?.[0]?.price && (
                          <span className="text-[10px] sm:text-[11px] text-muted line-through">₹{product.variants[0].originalPrice}</span>
                        )}
                        {product.rating && (
                          <span className="flex items-center text-[10px] text-amber-500 font-semibold ml-1.5">
                            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 mr-0.5" />
                            {product.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-base font-semibold text-foreground mb-1">No products found</p>
              <p className="text-xs text-muted max-w-sm mx-auto">
                We couldn't find any products matching "{query}". Try searching for Moringa, Beetroot, or Amla.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
