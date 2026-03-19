import React, { useEffect } from 'react';
import '../css/orderPlaced.css';
import { useCart } from '../context/CartContext';

const OrderPlaced = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart when order is placed
    clearCart();
  }, []); 

  return (
    <div id="orderContainer">
        <div id="check"><i className="fas fa-check-circle"></i></div>
        
        <div id="aboutCheck">
            <h1> Order Placed Successfully! </h1>
            <p> We've sent you an email with the Order details. </p>
        </div>
    </div>
  );
};

export default OrderPlaced;
