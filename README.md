# AgrivaFoods – Premium Natural Superfood E-Commerce Website

A modern, responsive, and production-ready React e-commerce frontend for **AgrivaFoods**, replicating the exact brand identity, styling, color palette, and layout of [https://nileshgawade.netlify.app/](https://nileshgawade.netlify.app/).

---

## 🚀 Quick Start

To run this application locally:

```bash
cd "C:\Users\NILESH\.gemini\antigravity\scratch\AgrivaFoods"

# Install dependencies (already installed)
npm install

# Start Vite Development Server
npm run dev

# Or build & preview production bundle
npm run build
npm run preview
```

The app will be accessible at: **[http://localhost:5173/](http://localhost:5173/)**

---

## 🎨 Brand Palette

- **Primary Green:** `#009447`
- **Dark Green:** `#184A35`
- **Natural Olive:** `#5F8610`
- **Bright Leaf Accent:** `#78A603`
- **Light Sage:** `#C7D2A8`
- **Very Light Sage:** `#DCE2C8`
- **Warm Cream Background:** `#FBF7F3`
- **Dark Text:** `#18382A`
- **Muted Green Text:** `#5C7C6D`

---

## 📦 Products Included

1. **AgrivaFoods Moringa Powder** (`organic-moringa-powder`)
   - Pack sizes: 100g (₹149), 250g (₹299), 500g (₹549), 1kg (₹999)
   - Real packaging asset: `public/assets/moringa-packaging.png`
2. **AgrivaFoods Beetroot Powder** (`beetroot-powder`)
   - Pack sizes: 100g (₹129), 250g (₹249), 500g (₹449), 1kg (₹799)
   - Real packaging asset: `public/assets/beetroot-packaging.png`
3. **AgrivaFoods Amla Powder** (`amla-powder`)
   - Pack sizes: 100g (₹99), 250g (₹199), 500g (₹349), 1kg (₹629)
   - Real packaging asset: `public/assets/amla-packaging.png`

---

## 📱 Contact Integrations

- **Phone:** `+91 88300 52087` (`tel:+918830052087`)
- **WhatsApp:** `https://wa.me/918830052087`
- **Email:** `agrivafoods03@gmail.com` (`mailto:agrivafoods03@gmail.com`)
- **Floating Contact Actions:** Bottom-right subtle WhatsApp & Call buttons across all pages.

---

## 🔌 Connecting a Real Backend in Future

All external network operations are abstracted under `src/services/`:
- `productService.js`
- `cartService.js`
- `authService.js`
- `orderService.js`
- `reviewService.js`
- `contactService.js`

To connect a live REST API, simply configure `.env`:
```env
VITE_API_BASE_URL=https://api.AgrivaFoods.com/api
```
All Axios requests in `src/services/api.js` automatically use this endpoint and attach Bearer tokens.
