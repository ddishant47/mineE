import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// For Guest users, we'll generate and store a unique identifier for backend persistence
const getUserId = () => {
    let id = localStorage.getItem('userId');
    if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', id);
    }
    return id;
};

// Helper to migrate old string-array carts to the new object-aware format
const sanitizeCartItems = (rawItems) => {
    if (!Array.isArray(rawItems)) return [];
    return rawItems.map(item => {
        // If it's just a string ID (old format), convert to object
        if (typeof item === 'string') {
            return { productId: item, quantity: 1 };
        }
        // If it's already an object but missing key fields, fix it
        if (item && item.productId) {
            return { productId: item.productId, quantity: item.quantity || 1 };
        }
        return null;
    }).filter(i => i !== null);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Array of { productId, quantity }
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  // Load cart from Backend and LocalStorage on init
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${userId}`);
        if (res.ok) {
            const data = await res.json();
            setCartItems(sanitizeCartItems(data.items));
        } else {
            // Fallback to local storage
            const rawLocal = JSON.parse(localStorage.getItem('cartItems')) || [];
            const sanitized = sanitizeCartItems(rawLocal);
            setCartItems(sanitized);
            // If it moved from old format to new, save it
            if (sanitized.length > 0) localStorage.setItem('cartItems', JSON.stringify(sanitized));
        }
      } catch (err) {
        console.error("Cart sync error:", err);
        const rawLocal = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(sanitizeCartItems(rawLocal));
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  // Sync with Backend whenever cartItems changes
  const syncToBackend = async (updatedItems) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updatedItems })
        });
    } catch (err) {
        console.error("Sync to backend failed:", err);
    }
  };

  const addToCart = (productId) => {
    setCartItems(prev => {
        const existing = prev.find(item => item.productId === productId);
        let updated;
        if (existing) {
            updated = prev.map(item => 
                item.productId === productId 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );
        } else {
            updated = [...prev, { productId, quantity: 1 }];
        }
        localStorage.setItem('cartItems', JSON.stringify(updated));
        syncToBackend(updated);
        return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      let updated;
      if (existing && existing.quantity > 1) {
        updated = prev.map(item => 
          item.productId === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
        );
      } else {
        updated = prev.filter(item => item.productId !== productId);
      }
      localStorage.setItem('cartItems', JSON.stringify(updated));
      syncToBackend(updated);
      return updated;
    });
  };

  const deleteFromCart = (productId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.productId !== productId);
      localStorage.setItem('cartItems', JSON.stringify(updated));
      syncToBackend(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    syncToBackend([]);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
        cartCount, 
        cartItems, 
        addToCart, 
        removeFromCart, 
        deleteFromCart, 
        clearCart, 
        getItemQuantity,
        loading 
    }}>
      {children}
    </CartContext.Provider>
  );
};
