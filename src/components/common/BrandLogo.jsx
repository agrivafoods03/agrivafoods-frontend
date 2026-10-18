import React from 'react';

export const BrandLogo = ({ variant = 'dark', className = '', size = 'md' }) => {
  const isLight = variant === 'light';
  const logoSrc = isLight ? '/assets/logo-white.png' : '/assets/logo.png';

  const sizeClasses = {
    sm: 'h-8 sm:h-9 md:h-10',
    md: 'h-8 xs:h-9 sm:h-12 md:h-14',
    lg: 'h-11 sm:h-14 md:h-20'
  }[size] || 'h-8 xs:h-9 sm:h-12 md:h-14';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="AgrivaFoods - Superfood. Naturally Better."
        className={`${sizeClasses} w-auto max-w-[130px] sm:max-w-none object-contain transition-transform duration-200 hover:scale-[1.03]`}
        loading="eager"
      />
    </div>
  );
};
