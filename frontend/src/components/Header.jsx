import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/header.css';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const query = e.target.searchBox.value.trim();
        if(query) {
            navigate(`/?search=${encodeURIComponent(query)}`);
        } else {
            navigate(`/`);
        }
    };

    return (
        <header>
            <section>
                <div id="container">
                    <div id="shopName"><Link to="/"> <b>MARKET</b><i className="nest">NEST</i></Link></div>
                    <div id="collection">
                        <div id="clothing"><Link to="/?search=mens clothing"> CLOTHING </Link></div>
                        <div id="accessories"><Link to="/?search=accessories"> ACCESSORIES </Link></div>
                        <div id="homeDecor"><Link to="/?search=home decor"> HOME DECOR </Link></div>
                    </div>
                    <div id="search">
                        <form onSubmit={handleSearch}>
                            <input 
                                type="text" 
                                id="input" 
                                name="searchBox" 
                                placeholder="Search products..." 
                            />
                            <i className="fas fa-search search"></i>
                        </form>
                    </div>
                    <div id="user">
                        <Link to="/cart" style={{ position: 'relative', display: 'inline-block' }}> 
                            <i className="fas fa-shopping-cart addedToCart"></i>
                            {cartCount > 0 && <span id="badge">{cartCount}</span>}
                        </Link>
                        <Link to="#"> <i className="fas fa-user-circle userIcon"></i> </Link>
                    </div>
                </div>
            </section>
        </header>
    );
};

export default Header;
