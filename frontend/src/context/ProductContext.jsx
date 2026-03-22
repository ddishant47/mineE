import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f1f5f9'/%3E%3Cpath d='M200 180c-33.14 0-60 26.86-60 60s26.86 60 60 60 60-26.86 60-60-26.86-60-60-60zm0 100c-22.09 0-40-17.91-40-40s17.91-40 40-40 40 17.91 40 40-17.91 40-40 40zm100 120H100v-40c0-33.14 26.86-60 60-60h80c33.14 0 60 26.86 60 60v40zm-20-20v-20c0-22.09-17.91-40-40-40h-80c-22.09 0-40 17.91-40 40v20h160z' fill='%23cbd5e1'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='Outfit, sans-serif' font-size='14' fill='%2394a3b8'%3EUNAVAILABLE%3C/text%3E%3C/svg%3E";

// Sanitization function to prevent bad requests from ever reaching the browser's network layer
const sanitizeProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(product => {
    // If the image URL is known to be bad or missing, replace it BEFORE it hits an <img> tag
    if (!product.image || product.image.includes("via.placeholder.com") || product.image.trim() === "") {
      return { ...product, image: PLACEHOLDER_IMAGE };
    }
    return product;
  });
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();
      
      // SANITIZE DATA HERE - Before it ever reaches any component
      const sanitizedData = sanitizeProducts(data);
      
      setProducts(sanitizedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error, refreshProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
