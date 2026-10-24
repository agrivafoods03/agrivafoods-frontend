export const mockOrders = [
  {
    id: "AGR-2026-8942",
    date: "2026-09-20",
    status: "Delivered",
    paymentMethod: "UPI (Google Pay)",
    trackingNumber: "DTDC-99281745",
    shippingAddress: {
      fullName: "Sample Customer",
      address: "12 Nature Valley, MG Road",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411001",
      phone: "9876543210"
    },
    items: [
      {
        id: 1,
        name: "AgrivaFoods Moringa Powder",
        weight: "250g",
        price: 299,
        quantity: 1,
        image: "/assets/moringa-packaging.png"
      },
      {
        id: 3,
        name: "AgrivaFoods Amla Powder",
        weight: "250g",
        price: 199,
        quantity: 1,
        image: "/assets/amla-packaging.png"
      }
    ],
    subtotal: 498,
    shipping: 0,
    total: 498
  }
];
