import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/cart.css';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, deleteFromCart } = useCart(); // Array of IDs
  const [products, setProducts] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);

  useEffect(() => {
    // Fetch all products from our custom API
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (products.length > 0 && cartItems.length > 0) {
      // Group items by ID
      const counts = {};
      cartItems.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
      });

      const details = Object.keys(counts).map(id => {
        // Find product matching the _id
        const product = products.find(p => p._id === id);
        return product ? { ...product, quantity: counts[id] } : null;
      }).filter(p => p !== null);

      setCartDetails(details);
    } else {
        setCartDetails([]);
    }
  }, [products, cartItems]);

  const totalAmount = cartDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div id="cartMainContainer">
      <h1> Checkout </h1>
      <h3 id="totalItem"> Total Items: {cartItems.length} </h3>
      
      <div id="cartContainer">
        <div id="boxContainer">
          {cartDetails.map(item => (
            <div id="box" key={item._id}>
              <img src={item.image} alt={item.name} />
              <div className="cartItemDetails">
                <h3>{item.name}</h3>
                <h4>Amount: Rs {item.price * item.quantity}</h4>
                <div className="cartControls" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                  <button onClick={() => removeFromCart(item._id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item._id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>+</button>
                  <button onClick={() => deleteFromCart(item._id)} style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div id="totalContainer">
          <div id="total">
            <h2>Total Amount</h2>
            <h4>Amount: Rs {totalAmount}</h4>
            <div id="button">
              <button><Link to="/order-placed" style={{color: 'white', textDecoration: 'none'}}>Place Order</Link></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
