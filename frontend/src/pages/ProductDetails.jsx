import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/contentDetails.css';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setPreviewImage(data.image);
      })
      .catch(err => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div id="containerProduct">
      <div id="containerD">
        <div id="imageSection">
          <img id="imgDetails" src={previewImage} alt={product.name} />
          <div id="button" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={() => addToCart(product._id)}>Add to Cart</button>
          </div>
        </div>
      </div>

      <div className="productDetailsColumn">

        <div id="productDetails">
          <h1>{product.name}</h1>
          <h4>{product.brand}</h4>

          <div id="details">
            <h3>Description</h3>
            <p>{product.description}</p>
            <h3 style={{ marginTop: '15px' }}>Rs {product.price}</h3>
          </div>



        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
