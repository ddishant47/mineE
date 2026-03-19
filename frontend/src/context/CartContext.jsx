import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]); // Array of product IDs

  useEffect(() => {
    // Load cart from localStorage on init
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCart);
    setCartCount(savedCart.length);
  }, []);

  const addToCart = (productId) => {
    const updatedCart = [...cartItems, productId];
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    // Remove one instance of the product ID (decrement)
    const index = cartItems.indexOf(productId);
    if (index > -1) {
      const updatedCart = [...cartItems];
      updatedCart.splice(index, 1);
      setCartItems(updatedCart);
      setCartCount(updatedCart.length);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
  };
  
  const deleteFromCart = (productId) => {
    // Remove all instances of the product ID (delete)
    const updatedCart = cartItems.filter(id => id !== productId);
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };
  
  const clearCart = () => {
      setCartItems([]);
      setCartCount(0);
      localStorage.removeItem('cartItems');
  }

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addToCart, removeFromCart, deleteFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
