import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../css/content.css';
import SimpleSlider from '../components/Slider';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const ProductSkeleton = () => (
  <div className="product-card skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-details">
      <div className="skeleton-line title"></div>
      <div className="skeleton-line brand"></div>
      <div className="skeleton-line price"></div>
    </div>
  </div>
);

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f1f5f9'/%3E%3Cpath d='M200 180c-33.14 0-60 26.86-60 60s26.86 60 60 60 60-26.86 60-60-26.86-60-60-60zm0 100c-22.09 0-40-17.91-40-40s17.91-40 40-40 40 17.91 40 40-17.91 40-40 40zm100 120H100v-40c0-33.14 26.86-60 60-60h80c33.14 0 60 26.86 60 60v40zm-20-20v-20c0-22.09-17.91-40-40-40h-80c-22.09 0-40 17.91-40 40v20h160z' fill='%23cbd5e1'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='Outfit, sans-serif' font-size='14' fill='%2394a3b8'%3EUNAVAILABLE%3C/text%3E%3C/svg%3E";

const ProductCard = ({ item }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item._id);

  const handleImageError = (e) => {
    if (e.target.src !== PLACEHOLDER_IMAGE) {
      e.target.src = PLACEHOLDER_IMAGE;
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${item._id}`}>
        <div className="product-image-container">
          <img 
            src={item.image || PLACEHOLDER_IMAGE} 
            alt={item.name} 
            loading="lazy" 
            className="product-img"
            onError={handleImageError}
          />
          <div className="product-overlay">
            <span>View Details</span>
          </div>
        </div>
      </Link>
      <div className="product-details">
        <span className="product-brand">{item.brand}</span>
        <h3 className="product-title">{item.name}</h3>
        <div className="product-footer">
          <span className="product-price">₹{item.price.toLocaleString()}</span>
          {quantity > 0 ? (
            <div className="quantity-controls-mini">
              <button onClick={() => removeFromCart(item._id)}>−</button>
              <span className="quantity-badge-mini">{quantity}</span>
              <button onClick={() => addToCart(item._id)}>+</button>
            </div>
          ) : (
            <button className="add-btn-mini" onClick={() => addToCart(item._id)}>+</button>
          )}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("search")?.toLowerCase() || "";

  const filteredProducts = products.filter(item => {
    if (!searchParam) return true;
    const searchText = `${item.name} ${item.brand} ${item.description} ${item.category}`.toLowerCase();
    
    // Exact mapping for header categories to make them reliable
    if (searchParam === 'mens clothing') {
        return (searchText.includes('men') || searchText.includes('boy')) && !searchText.includes('women');
    }
    if (searchParam === 'women clothing' || searchParam === 'womens clothing') {
        return searchText.includes('women') || searchText.includes('girl');
    }
    if (searchParam === 'house decor' || searchParam === 'home decor') {
        return searchText.includes('home') || searchText.includes('decor') || searchText.includes('house');
    }
    if (searchParam === 'accessories') {
        return item.isAccessory || searchText.includes('accessory');
    }

    return searchText.includes(searchParam);
  });

  // Group by category dynamically if NOT searching
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts).sort();

  return (
    <div className="home-page">
      {!searchParam && <SimpleSlider />}
      
      <main id="mainContainer">
        {loading ? (
          <section className="product-section">
            <div className="section-header">
              <div className="skeleton-line-lg title" style={{ width: '200px', height: '30px' }}></div>
              <div className="section-line"></div>
            </div>
            <div className="product-grid">
              {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          </section>
        ) : searchParam ? (
          /* Search Results View - Unified Grid */
          <section className="product-section">
            <div className="section-header">
              <h2 className="section-title">Results for "{searchParam}"</h2>
              <div className="section-line"></div>
            </div>
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(item => <ProductCard key={item._id} item={item} />)
              ) : (
                <div className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  <h2>No products found</h2>
                  <p>Try a different keyword!</p>
                  <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Shop All</Link>
                </div>
              )}
            </div>
          </section>
        ) : (
          /* Browse View - Grouped by Category */
          categories.map(cat => (
            <section className="product-section" key={cat}>
              <div className="section-header">
                <h2 className="section-title">{cat}</h2>
                <div className="section-line"></div>
              </div>
              <div className="product-grid">
                {groupedProducts[cat].map(item => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            </section>
          ))
        )}

        {!loading && filteredProducts.length === 0 && searchParam && (
          <div className="no-results">
            <h2>Hiding place found!</h2>
            <p>But we couldn't find your product. Try another search!</p>
            <Link to="/" className="continue-shopping-btn">Explore Full Collection</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
