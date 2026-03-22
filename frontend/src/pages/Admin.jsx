import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/admin.css';

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='10' fill='%2394a3b8'%3ENO IMAGE%3C/text%3E%3C/svg%3E";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: ''
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await response.json();
      const sanitized = data.map(p => (!p.image || p.image.includes("via.placeholder.com")) ? { ...p, image: PLACEHOLDER_IMAGE } : p);
      setProducts(sanitized);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing ? `${import.meta.env.VITE_API_URL}/api/update/${currentProductId}` : `${import.meta.env.VITE_API_URL}/api/products`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
        resetForm();
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProductId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      image: product.image,
      category: product.category || '',
      stock: product.stock || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete/${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Product deleted successfully');
          fetchProducts();
        } else {
          alert('Error deleting product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', image: '', category: '', stock: '' });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  if (loading) return <div className="admin-container">Loading Dashboard...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-title-row">
            <div>
                <h1>Admin Dashboard</h1>
                <p>Overview and Content Management</p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
                🚪 Log Out
            </button>
        </div>
      </header>

      <section className="admin-section">
        <h2>{isEditing ? '📝 Edit Product' : '➕ Add New Product'}</h2>
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name*</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Premium Coffee Beans" />
          </div>
          <div className="form-group">
            <label>Price (₹)*</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Beverages" />
          </div>
          <div className="form-group">
            <label>Stock Quantity</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="0" />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Image URL*</label>
            <input type="text" name="image" value={formData.image} onChange={handleInputChange} required placeholder="https://example.com/image.jpg" />
          </div>
          <div className="form-group full-width">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter detailed product description..." />
          </div>
          <div className="form-actions">
            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h2>📦 Inventory List ({products.length})</h2>
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.image} alt={product.name} className="product-img-mini" onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
                  </td>
                  <td><strong>{product.name}</strong></td>
                  <td>{product.category || 'N/A'}</td>
                  <td className="price-cell">₹{product.price.toLocaleString()}</td>
                  <td><span className="stock-badge">{product.stock || 0} in stock</span></td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => handleEdit(product)} title="Edit">✏️</button>
                    <button className="icon-btn delete" onClick={() => handleDelete(product._id)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Admin;
