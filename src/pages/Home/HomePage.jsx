import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockReviews } from '../../data/mockReviews';
import { mockFAQs } from '../../data/mockFAQs';
import { ProductCard } from '../../components/product/ProductCard';
import { contactService } from '../../services/contactService';
import { productService } from '../../services/productService';
import { publicApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  ArrowRight,
  Star,
  ChevronDown,
  Phone,
  Send,
  Zap,
  Activity,
  Heart,
  Droplets
} from 'lucide-react';

export const HomePage = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [homepageConfig, setHomepageConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Dynamically load active products and homepage customizations
    setLoadingProducts(true);
    productService.getProducts()
      .then((data) => {
        setProducts(data || []);
      })
      .catch((err) => {
        console.warn('Failed to load products from API:', err);
        setProducts([]);
      })
      .finally(() => setLoadingProducts(false));

    publicApi.getHomepage()
      .then((res) => {
        if (res?.data) {
          setHomepageConfig(res.data);
        }
      })
      .catch((err) => console.warn('Failed to load homepage config:', err));
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    await contactService.subscribeNewsletter(newsletterEmail);
    setNewsletterSubscribed(true);
    showToast('Subscribed! Thank you for connecting with AgrivaFoods.', 'success');
  };

  const trustFeatures = [
    {
      icon: Leaf,
      title: '100% Natural',
      desc: 'Pure single-ingredient powders with absolutely zero additives, sugar, or preservatives.'
    },
    {
      icon: Zap,
      title: 'Carefully Processed',
      desc: 'Dehydrated at low temperatures to lock in maximum nutrition and chlorophyll.'
    },
    {
      icon: ShieldCheck,
      title: 'Lab Tested',
      desc: 'Rigorously tested for purity and heavy metals, ensuring a premium organic supplement.'
    },
    {
      icon: Heart,
      title: 'Quality Focused',
      desc: "Ethically sourced directly from India's finest sustainable organic farms."
    }
  ];

  const whyChooseCards = [
    {
      title: 'Naturally Sourced',
      desc: 'Harvested at peak potency from native Indian soils.'
    },
    {
      title: 'Quality Focused',
      desc: 'Triple-filtered grinding process for an ultra-fine texture.'
    },
    {
      title: 'Carefully Processed',
      desc: 'No heat exposure to maintain bio-active enzymes.'
    },
    {
      title: 'Fresh & Pure',
      desc: 'Packaged quickly in airtight zip-locks to prevent oxidation.'
    },
    {
      title: 'Customer First',
      desc: 'Delivered fresh to your doorstep with 100% satisfaction guarantee.'
    },
    {
      title: 'Made With Care',
      desc: 'Crafted in small batches with strict hygiene standards.'
    }
  ];

  const featuredProduct = products.find(
    (p) => p.slug === homepageConfig?.featuredProductSlug
  ) || (products.length > 0 ? products[0] : null);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Top Announcement Bar if configured */}
      {homepageConfig?.announcementText && (
        <div className="bg-[#122A1F] text-[#86D39D] text-xs font-semibold py-2.5 px-4 text-center tracking-wide shadow-xs flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#009447]" />
          <span>{homepageConfig.announcementText}</span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FBF7F3] via-white/50 to-[#FBF7F3] pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-sage-light/50">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-24 right-0 w-96 h-96 bg-sage-light/30 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sage-light shadow-xs">
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  {homepageConfig?.heroBadge || 'Organic • Natural • Premium'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-dark leading-[1.1] tracking-tight whitespace-pre-line">
                {homepageConfig?.heroTitle ? (
                  homepageConfig.heroTitle
                ) : (
                  <>
                    SUPERFOOD.
                    <br />
                    <span className="text-gradient">NATURALLY BETTER.</span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-muted font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {homepageConfig?.heroSubtitle ||
                  'Pure, potent, and carefully processed natural powders to power your everyday wellness. Sustainably sourced, lab tested, and direct from farms.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
                <Link
                  to={homepageConfig?.heroCtaLink || '/products'}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm sm:text-base rounded-xl shadow-premium hover:shadow-premium-hover transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  <span>{homepageConfig?.heroCtaText || 'Shop Now'}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>

                <Link
                  to="/about"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-white border border-primary/20 hover:border-primary text-primary-dark font-bold text-sm sm:text-base rounded-xl hover:bg-cream/40 transition-colors text-center"
                >
                  Our Story
                </Link>
              </div>

              {/* Direct Support Pills */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs text-muted font-bold">
                <span className="text-primary-dark/60 font-semibold uppercase tracking-wider text-[10px]">
                  Contact Us:
                </span>
                <a
                  href="tel:+918830052087"
                  className="flex items-center gap-1 hover:text-primary transition-all bg-white/70 border border-sage-light hover:border-primary/30 px-2.5 sm:px-3 py-1.5 rounded-lg shadow-2xs hover:shadow-xs"
                  title="Call Us: +91 88300 52087"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>Call Us</span>
                </a>
                <a
                  href="https://wa.me/918830052087"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-600 transition-all bg-white/70 border border-sage-light hover:border-emerald-500/30 px-2.5 sm:px-3 py-1.5 rounded-lg shadow-2xs hover:shadow-xs"
                  title="WhatsApp Chat"
                >
                  <svg className="h-3.5 w-3.5 fill-emerald-600" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.973 4.478-9.973 10.008 0 1.777.462 3.516 1.342 5.051L2 22l5.127-1.349a9.907 9.907 0 0 0 4.885 1.255h.005c5.507 0 9.973-4.477 9.973-10.007C21.99 6.478 17.52 2 12.012 2zm5.72 14.184c-.244.693-1.42 1.353-1.956 1.444-.488.082-.996.122-2.585-.541-2.029-.844-3.328-2.92-3.429-3.057-.101-.136-.82-.998-.82-1.995 0-.998.512-1.488.695-1.69.183-.203.407-.254.549-.254.142 0 .285.002.407.008.127.006.299-.047.468.36.173.417.59 1.458.641 1.564.051.106.082.23.01.376-.071.147-.107.24-.224.376-.117.136-.248.274-.356.39-.1" />
                  </svg>
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Right Hero Product Feature Focus */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] xs:max-w-xs sm:max-w-sm mx-auto">
                <span className="absolute -top-6 -left-6 text-primary/20 text-5xl select-none hidden sm:block">
                  🌿
                </span>
                <span className="absolute -bottom-6 -right-6 text-primary/20 text-5xl select-none hidden sm:block">
                  🌿
                </span>

                {featuredProduct ? (
                  <Link
                    to={`/products/${featuredProduct.slug}`}
                    className="block bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-sage-light/50 transform sm:rotate-2 sm:hover:rotate-0 transition-transform duration-500 group"
                  >
                    <div className="aspect-[3/4] w-full bg-cream/30 rounded-2xl p-4 overflow-hidden flex items-center justify-center border border-sage-light/20 relative">
                      <img
                        src={
                          homepageConfig?.heroImage ||
                          (featuredProduct.images && featuredProduct.images[0]) ||
                          '/assets/moringa-packaging.png'
                        }
                        alt={featuredProduct.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="mt-4 text-center">
                      <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
                        Featured Superfood
                      </span>
                      <h3 className="font-extrabold text-primary-dark text-base sm:text-lg mt-0.5 group-hover:text-primary transition-colors">
                        {featuredProduct.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 mt-1 text-xs font-semibold text-foreground">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>
                          {featuredProduct.rating || 4.9} ({featuredProduct.reviewCount || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sage-light/50 text-center flex flex-col items-center justify-center min-h-[300px] sm:min-h-[340px]">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <Leaf className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                      AgrivaFoods Pure Harvest
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-primary-dark mt-2">
                      100% Organic Superfoods
                    </h3>
                    <p className="text-xs text-muted mt-2 leading-relaxed max-w-xs">
                      Single-ingredient botanical wellness powders sourced directly from certified organic farms.
                    </p>
                    <Link
                      to="/products"
                      className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-xs"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST AND QUALITY SECTION */}
      <section className="py-8 sm:py-12 bg-white border-y border-sage-light/50 relative z-10 mt-2 sm:-mt-10 md:-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {trustFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="flex gap-3.5 sm:gap-4 items-start p-1.5 sm:p-2 hover:translate-y-[-2px] transition-transform duration-300"
                >
                  <div className="p-2.5 sm:p-3 bg-cream rounded-2xl border border-sage-light/50 flex-shrink-0">
                    <IconComp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-0.5 sm:mb-1">{feat.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SUPERFOODS */}
      {homepageConfig?.showFeaturedSection !== false && (
        <section id="featured" className="py-12 sm:py-20 bg-cream/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-2">
                Our Superfoods
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-dark">
                Pure Nutrition. Naturally Sourced.
              </h2>
              <div className="h-1 w-16 bg-primary rounded-full mx-auto mt-4" />
              <p className="text-xs sm:text-sm text-muted mt-4">
                Explore our range of premium single-ingredient powders made from organically grown ingredients rich in natural vitamins and minerals.
              </p>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
                {products.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-sage-light p-8 max-w-lg mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#FBF7F3] border border-sage-light flex items-center justify-center mx-auto mb-4 text-primary">
                  <Leaf className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-primary-dark mb-1">Fresh Superfoods Coming Soon</h3>
                <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                  We are preparing fresh batches of 100% pure botanical powders. Check back shortly or contact our team for batch reservations.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Link
                    to="/contact"
                    className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. WHY CHOOSE AgrivaFoods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-5">
              <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-2">
                Our Quality Standard
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-6">
                Why Choose AgrivaFoods?
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                We believe that superfoods should be pure and natural. We don't cut corners. From farm soil assessment to strict chemical testing, we trace our powders at every stage.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-bold text-foreground">
                    Sustainably harvested directly in India
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-bold text-foreground">
                    Lab tested for heavy metals and purity
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-bold text-foreground">
                    Fine milled for maximum solubility
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 text-primary font-bold hover:text-primary-dark border-b-2 border-primary hover:border-primary-dark pb-0.5 transition-colors"
                >
                  <span>Explore All Powders</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right: 6 Numbered Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyChooseCards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-cream/20 rounded-2xl border border-sage-light/60 hover:bg-cream/40 transition-colors"
                >
                  <span className="bg-primary/10 text-primary-dark text-xs font-bold px-2 py-0.5 rounded-full">
                    0{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-primary-dark mt-3 mb-2">{card.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. NUTRITIONAL POWERHOUSE SECTION */}
      <section className="py-20 bg-cream/30 relative">
        <div className="absolute inset-0 leaf-pattern opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-2">
              Nutritional Powerhouse
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-8">
              All The Goodness. Naturally.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center mt-12">
              <div className="bg-white rounded-2xl p-6 shadow-premium border border-sage-light/50">
                <h3 className="text-3xl font-extrabold text-primary mb-2">90+</h3>
                <h4 className="text-sm font-bold text-primary-dark mb-1">Essential Nutrients</h4>
                <p className="text-xs text-muted">
                  Moringa contains 92 vitamins & minerals, providing complete botanical nutrition.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-premium border border-sage-light/50">
                <h3 className="text-3xl font-extrabold text-primary mb-2">10x</h3>
                <h4 className="text-sm font-bold text-primary-dark mb-1">More Vitamin C</h4>
                <p className="text-xs text-muted">
                  Amla is packed with up to 20x more natural vitamin C than an orange.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-premium border border-sage-light/50">
                <h3 className="text-3xl font-extrabold text-primary mb-2">100%</h3>
                <h4 className="text-sm font-bold text-primary-dark mb-1">Active Nitrates</h4>
                <p className="text-xs text-muted">
                  Beetroot provides pure dietary nitrates for sustained physical performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BORN FROM A COMMITMENT TO PURITY STORY BANNER */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-primary-dark text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 h-40 w-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="md:w-2/3">
              <span className="text-xs font-bold text-primary bg-white px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                Our Story
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Born from a Commitment to Purity
              </h2>
              <p className="text-sm text-sage/80 leading-relaxed mb-6">
                AgrivaFoods was founded on a simple principle: nature has already perfected the nutrients our bodies need. We set out to make Indian superfoods accessible, clean, and completely transparent, bringing the rich heritage of organic herbs straight to modern kitchens.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Read Full Story</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="md:w-1/3 flex justify-center text-8xl select-none">
              🌱
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      {homepageConfig?.showReviewsSection !== false && (
        <section id="reviews" className="py-20 bg-cream/10 border-t border-sage-light/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-2">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark">
                What Our Customers Say
              </h2>
              <div className="h-1 w-16 bg-primary rounded-full mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {mockReviews.slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-6 border border-sage-light shadow-premium flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-muted">{rev.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1.5 leading-snug">
                      "{rev.title}"
                    </h4>
                    <p className="text-xs text-muted leading-relaxed mb-4">{rev.comment}</p>
                  </div>

                  <div className="pt-3 border-t border-sage-light/60 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-primary-dark">{rev.name}</span>
                      <span className="text-[10px] text-muted">{rev.location}</span>
                    </div>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark hover:underline transition-all"
              >
                <span>Read all customer reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      {homepageConfig?.showFaqSection !== false && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-primary-dark mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-sage-light shadow-premium divide-y divide-sage-light/60 overflow-hidden">
            {mockFAQs[0].questions.slice(0, 4).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="transition-colors">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="text-sm font-bold text-foreground">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-primary transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs text-muted leading-relaxed animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <Link to="/faq" className="text-xs font-bold text-primary hover:underline">
              View all questions & answers →
            </Link>
          </div>
        </section>
      )}

      {/* 9. NEWSLETTER SUBSCRIPTION */}
      {homepageConfig?.showNewsletterSection !== false && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
          <div className="bg-gradient-to-r from-[#184A35] to-[#009447] text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C7D2A8]">
                Stay Connected With AgrivaFoods
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Get updates about our products, offers, and more.
              </h2>
              <p className="text-xs sm:text-sm text-[#FBF7F3]/85">
                Subscribe to receive wellness recipes, early access to new superfood powders, and exclusive seasonal promotions.
              </p>

              {newsletterSubscribed ? (
                <div className="pt-4 flex items-center justify-center gap-2 text-sm font-bold text-white bg-white/20 px-6 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>You're subscribed! Thank you for joining our community.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="pt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full px-4 py-3 rounded-xl bg-white text-foreground placeholder:text-muted/70 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#184A35] hover:bg-[#18382A] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
