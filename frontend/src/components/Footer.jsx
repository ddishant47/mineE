import React from 'react';
import '../css/footer.css';

const Footer = () => {
    return (
        <footer>
            <section>
                <div id="containerFooter">

                    <div id="webFooter">
                        <h3> Online Store </h3>
                        <p><a href="/?search=mens+clothing" style={{ color: 'inherit', textDecoration: 'none' }}> men clothing </a></p>
                        <p><a href="/?search=women+clothing" style={{ color: 'inherit', textDecoration: 'none' }}> women clothing </a></p>
                        <p><a href="/?search=mens+clothing" style={{ color: 'inherit', textDecoration: 'none' }}> men accessories </a></p>
                        <p><a href="/?search=women+clothing" style={{ color: 'inherit', textDecoration: 'none' }}> women accessories </a></p>
                        <p><a href="/?search=house+decor" style={{ color: 'inherit', textDecoration: 'none' }}> home decor </a></p>
                    </div>
                    <div id="webFooter">
                        <h3> Helpful link </h3>
                        <p><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}> Home </a></p>
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
