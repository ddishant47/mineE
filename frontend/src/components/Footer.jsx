import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';

const Footer = () => {
    return (
        <footer>
            <section>
                <div id="containerFooter">

                    <div id="webFooter">
                        <h3> Online Store </h3>
                        <p><Link to="/?search=mens clothing"> men clothing </Link></p>
                        <p><Link to="/?search=women clothing"> women clothing </Link></p>
                        <p><Link to="/?search=accessories"> accessories </Link></p>
                        <p><Link to="/?search=home decor"> home decor </Link></p>
                    </div>
                    <div id="webFooter">
                        <h3> Helpful link </h3>
                        <p><Link to="/"> Home </Link></p>
                        <p> About </p>
                        <p> Contact </p>
                    </div>
                    <div id="webFooter">
                        <h3> Partners </h3>
                        <p> Zara </p>
                        <p> Pantaloons </p>
                        <p> Levis </p>
                        <p> UCP </p>
                        <p> + Many More </p>
                    </div>
                    <div id="webFooter">
                        <h3> Address </h3>
                        <p> Building 101 </p>
                        <p> Central Avenue </p>
                        <p> lA - 902722 </p>
                        <p> United States </p>
                    </div>
                </div>

            </section>

        </footer>
    );
};

export default Footer;
