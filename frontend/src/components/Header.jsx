import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { cartCount } = useCart();

    return (
        <header>
            <section>
                <div id="container">
                    <div id="shopName"><Link to="/"> <b>MARKET</b><i className="nest">NEST</i></Link></div>
                    <div id="collection">
                        <div id="clothing"><Link to="/"> CLOTHING </Link></div>
                        <div id="accessories"><Link to="/"> ACCESSORIES </Link></div>
                        <div id="homeDecor"><Link to="/"> HOME DECOR </Link></div>
                    </div>
                    <div id="search">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const query = e.target.searchBox.value.trim();
                            if(query) {
                                window.location.href = `/?search=${encodeURIComponent(query)}`;
                            } else {
                                window.location.href = `/`;
                            }
                        }} style={{display: 'inline'}}>
                            <i className="fas fa-search search"></i>
                            <input type="text" id="input" name="searchBox" placeholder="Search for Clothing , Accessories , Home Decor" list="search-suggestions" />
                            <datalist id="search-suggestions">
                                <option value="mens clothing" />
                                <option value="women clothing" />
                                <option value="house decor" />
                            </datalist>
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
