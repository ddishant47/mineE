import React, { useState, useEffect } from 'react';
import '../css/admin.css';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/update/${currentProductId}`
      : 'http://localhost:5000/api/products';

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
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
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete/${id}`, {
          method: 'DELETE'
        });

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
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      category: '',
      stock: ''
    });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  if (loading) return <div className="admin-container">Loading...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your store products</p>
      </div>

      <div className="admin-section">
        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g. Premium Coffee Beans"
            />
          </div>
          <div className="form-group">
            <label>Price ($)*</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g. Beverages"
            />
          </div>
          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Image URL*</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product details..."
            />
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
      </div>

      <div className="admin-section">
        <h2>All Products ({products.length})</h2>
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
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
                    <img src={product.image} alt={product.name} className="product-img-mini" />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category || 'N/A'}</td>
                  <td>${product.price}</td>
                  <td>{product.stock || 0}</td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(product)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(product._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
