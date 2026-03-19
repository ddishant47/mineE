import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/content.css';
import SimpleSlider from '../components/Slider';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const searchParam = new URLSearchParams(window.location.search).get("search")?.toLowerCase() || "";

  const filteredProducts = products.filter(item => {
    if (!searchParam) return true;

    const searchText = `${item.name} ${item.brand} ${item.description}`.toLowerCase();

    if (searchParam === 'mens clothing') {
      return !item.isAccessory && (searchText.includes('men') || searchText.includes('boy')) && !searchText.includes('women');
    }
    if (searchParam === 'women clothing' || searchParam === 'womens clothing') {
      return !item.isAccessory && (searchText.includes('women') || searchText.includes('girl'));
    }
    if (searchParam === 'house decor' || searchParam === 'home decor') {
      return searchText.includes('home') || searchText.includes('decor') || searchText.includes('house');
    }

    return searchText.includes(searchParam);
  });

  const clothing = filteredProducts.filter(item => !item.isAccessory);
  const accessories = filteredProducts.filter(item => item.isAccessory);

  const ProductCard = ({ item }) => (
    <div id="box">
      <Link to={`/product/${item._id}`}>
        <img src={item.image} alt={item.name} />
        <div id="details">
          <h3>{item.name}</h3>
          <h4>{item.brand}</h4>
          <h2>Rs {item.price}</h2>
        </div>
      </Link>
    </div>
  );

  return (
    <>
      <SimpleSlider />
      <main id="mainContainer">
        <section className="product-section">

          <div id="containerClothing">
            {clothing.map(item => <ProductCard key={item._id} item={item} />)}
          </div>
        </section>

        <section className="product-section">

          <div id="containerAccessories">
            {accessories.map(item => <ProductCard key={item._id} item={item} />)}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
