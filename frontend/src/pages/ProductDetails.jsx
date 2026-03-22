import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/contentDetails.css';
import { useCart } from '../context/CartContext';

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f1f5f9'/%3E%3Cpath d='M200 180c-33.14 0-60 26.86-60 60s26.86 60 60 60 60-26.86 60-60-26.86-60-60-60zm0 100c-22.09 0-40-17.91-40-40s17.91-40 40-40 40 17.91 40 40-17.91 40-40 40zm100 120H100v-40c0-33.14 26.86-60 60-60h80c33.14 0 60 26.86 60 60v40zm-20-20v-20c0-22.09-17.91-40-40-40h-80c-22.09 0-40 17.91-40 40v20h160z' fill='%23cbd5e1'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='Outfit, sans-serif' font-size='14' fill='%2394a3b8'%3EUNAVAILABLE%3C/text%3E%3C/svg%3E";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, getItemQuantity } = useCart();

  const handleImageError = (e) => {
    if (e.target.src !== PLACEHOLDER_IMAGE) {
      e.target.src = PLACEHOLDER_IMAGE;
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.image || data.image.includes("via.placeholder.com")) {
            data.image = PLACEHOLDER_IMAGE;
        }
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="details-skeleton-container">
        <div className="skeleton-img-lg"></div>
        <div className="skeleton-content-lg">
          <div className="skeleton-line-lg title"></div>
          <div className="skeleton-line-lg brand"></div>
          <div className="skeleton-line-lg desc"></div>
          <div className="skeleton-line-lg price"></div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div id="containerProduct">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>{product.name}</span>
      </div>
      
      <div className="product-layout">
        <div id="imageSection">
          <div className="main-image-wrapper">
            <img 
              id="imgDetails" 
              src={product.image || PLACEHOLDER_IMAGE} 
              alt={product.name} 
              loading="lazy"
              onError={handleImageError}
              onLoad={(e) => e.target.classList.add('loaded')}
            />
          </div>
        </div>

        <div className="productDetailsColumn">
          <div id="productDetails">
            <span className="brand-label">{product.brand || 'Premium Brand'}</span>
            <h1 className="product-name">{product.name}</h1>
            
            <div className="price-tag">
                <span className="currency">₹</span>
                <span className="value">{product.price?.toLocaleString()}</span>
            </div>

            <div className="trust-badges">
                <div className="badge-item">
                    <span className="badge-icon">✓</span>
                    <span className="badge-text">Authentic Product</span>
                </div>
                <div className="badge-item">
                    <span className="badge-icon">↺</span>
                    <span className="badge-text">7-Day Return Policy</span>
                </div>
                <div className="badge-item">
                    <span className="badge-icon">🚚</span>
                    <span className="badge-text">Free Fast Delivery</span>
                </div>
            </div>

            <div id="details">
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="purchase-actions">
                {getItemQuantity(product._id) > 0 ? (
                  <div className="quantity-selector-lg">
                    <button onClick={() => removeFromCart(product._id)}>−</button>
                    <span className="qty-value">{getItemQuantity(product._id)}</span>
                    <button onClick={() => addToCart(product._id)}>+</button>
                  </div>
                ) : (
                  <button className="add-to-cart-btn" onClick={() => addToCart(product._id)}>
                      Add to Cart
                  </button>
                )}
                <button className="wishlist-btn" title="Add to Wishlist">
                    ♡
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
