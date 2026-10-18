export const contactService = {
  async submitContactForm(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Thank you for reaching out! Our team will get back to you shortly.'
        });
      }, 150);
    });
  },

  async subscribeNewsletter(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Thank you for subscribing to AgrivaFoods updates!'
        });
      }, 100);
    });
  }
};
