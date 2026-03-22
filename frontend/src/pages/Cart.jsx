import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/cart.css';
import { useCart } from '../context/CartContext';

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='10' fill='%2394a3b8'%3ENO IMAGE%3C/text%3E%3C/svg%3E";

const Cart = () => {
  const { cartItems, cartCount, addToCart, removeFromCart, deleteFromCart, clearCart, loading: cartLoading } = useCart();
  const [products, setProducts] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const navigate = useNavigate();

  const handleImageError = (e) => {
    if (e.target.src !== PLACEHOLDER_IMAGE) {
      e.target.src = PLACEHOLDER_IMAGE;
    }
  };

  const sanitizeProducts = (products) => {
    return products.map(product => {
      if (!product.image || product.image.includes("via.placeholder.com")) {
        return { ...product, image: PLACEHOLDER_IMAGE };
      }
      return product;
    });
  };

  useEffect(() => {
    setProductsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
          setProducts(sanitizeProducts(data));
          setProductsLoading(false);
      })
      .catch(err => {
          console.error("Error fetching products:", err);
          setProductsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (products.length > 0 && cartItems.length > 0) {
      const details = cartItems.map(item => {
        const product = products.find(p => p._id === item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
      }).filter(p => p !== null);

      setCartDetails(details);
    } else {
        setCartDetails([]);
    }
  }, [products, cartItems]);

  const totalAmount = cartDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isLoading = cartLoading || productsLoading;

  const CartSkeleton = () => (
    <div className="cart-skeleton-box">
      <div className="skeleton-img-mini"></div>
      <div className="skeleton-details-mini" style={{ flex: 1 }}>
        <div className="skeleton-line-mini title"></div>
        <div className="skeleton-line-mini price"></div>
      </div>
    </div>
  );

  const handleCheckout = async () => {
    if (cartDetails.length === 0) return;

    try {
      const orderData = {
        items: cartDetails.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
          clearCart();
          navigate('/order-placed');
      } else {
          alert("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("An error occurred during checkout.");
    }
  };

  return (
    <div id="cartMainContainer">
      <h1> Shopping Cart </h1>
      <h3 id="totalItem"> Total Items: {cartCount} </h3>
      
      <div id="cartContainer">
        <div id="boxContainer">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <CartSkeleton key={i} />)
          ) : cartDetails.length === 0 ? (
            <div className="empty-cart-container">
                <div className="empty-cart-icon">🛒</div>
                <h2>Your shopping bag is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="continue-shopping-btn">
                    Explore Products
                </Link>
            </div>
          ) : (
            cartDetails.map(item => (
              <div id="box" key={item._id}>
                <img 
                  src={item.image || PLACEHOLDER_IMAGE} 
                  alt={item.name} 
                  onError={handleImageError}
                />
                <div className="cartItemDetails">
                  <h3>{item.name}</h3>
                  <h4>Amount: ₹{(item.price * item.quantity).toLocaleString()}</h4>
                  <div className="cartControls" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                    <button onClick={() => removeFromCart(item._id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item._id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>+</button>
                    <button onClick={() => deleteFromCart(item._id)} className="delete-btn" style={{ marginLeft: 'auto' }}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cartDetails.length > 0 && !isLoading && (
          <div id="totalContainer">
            <div id="total">
              <h2>Total Amount</h2>
              <h4>Amount: ₹{totalAmount.toLocaleString()}</h4>
              <div id="button" style={{ marginTop: '20px' }}>
                <button onClick={handleCheckout} style={{ color: 'white', border: 'none', background: 'var(--primary)', padding: '15px 30px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', width: '100%', fontSize: '1.1rem', fontWeight: 'bold' }}>Place Order</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
