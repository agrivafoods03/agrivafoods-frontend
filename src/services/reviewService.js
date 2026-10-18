import { mockReviews } from '../data/mockReviews';

const REVIEWS_KEY = 'Agriva_submitted_reviews';

export const reviewService = {
  getReviews() {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      const userReviews = stored ? JSON.parse(stored) : [];
      return [...userReviews, ...mockReviews];
    } catch {
      return mockReviews;
    }
  },

  async submitReview(reviewData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview = {
          id: 'rev_' + Date.now(),
          date: 'Just now',
          verified: true,
          helpfulCount: 0,
          ...reviewData
        };

        try {
          const stored = localStorage.getItem(REVIEWS_KEY);
          const userReviews = stored ? JSON.parse(stored) : [];
          userReviews.unshift(newReview);
          localStorage.setItem(REVIEWS_KEY, JSON.stringify(userReviews));
        } catch (e) {
          console.error('Failed to save review', e);
        }

        resolve(newReview);
      }, 100);
    });
  }
};
