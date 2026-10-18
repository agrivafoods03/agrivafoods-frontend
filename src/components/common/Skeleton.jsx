import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-sage-light overflow-hidden shadow-premium p-4 flex flex-col gap-3">
    <div className="w-full aspect-square shimmer-bg rounded-xl" />
    <div className="h-4 w-3/4 shimmer-bg rounded mt-2" />
    <div className="h-3 w-1/2 shimmer-bg rounded" />
    <div className="flex justify-between items-center mt-3 pt-2 border-t border-sage-light/60">
      <div className="h-5 w-1/3 shimmer-bg rounded" />
      <div className="h-8 w-24 shimmer-bg rounded-lg" />
    </div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => (
  <div className="text-center py-16 px-4 bg-white/70 border border-sage-light rounded-2xl max-w-lg mx-auto shadow-premium">
    {Icon && (
      <div className="w-16 h-16 bg-[#FBF7F3] border border-sage-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
    )}
    <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted mb-6 max-w-sm mx-auto">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        {actionText}
      </button>
    )}
  </div>
);
