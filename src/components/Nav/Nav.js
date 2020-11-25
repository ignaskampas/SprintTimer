import React, {useState} from 'react';
import styles from './nav.module';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {updateAuthState} from '../../redux/actions/authStateActions';
import {firebaseAuth} from '../../firebase/index.js';

function Nav(props) {
    var [isOpen, setIsOpen] = useState(false);
    
    const navSlide = function() {
        setIsOpen(!isOpen);
    }

    const closeNav = function(){
        setIsOpen(false);
    }

    const signOut = function(){
        firebaseAuth.signOut().then(function() {
          }).catch(function(error) {
            console.log(error);
          });
    }

    return (
        <nav className={styles.nav}>
            <div className={styles.navCenter}>
                <Link to='/'  style={{ textDecoration: 'none' }}>
                    <div className={[styles.logo, styles.navItem].join(" ")}>
                        Sprint Timer
                    </div>
                </Link>
                
                {props.isLoggedIn ? 
                    <div>
                        <ul className={isOpen ? [styles.navOpen, styles.navLinks].join(' ') : styles.navLinks}>
                            <Link to='/' onClick={closeNav}>
                                <li className={styles.navItem}>Home</li>
                            </Link>
                            <Link to='/saved' onClick={closeNav}>
                                <li className={styles.navItem}>Saved</li>
                            </Link>
                            <li onClick={closeNav}>
                                <a className={styles.navItem} href="#" onClick={signOut}>Log Out</a>
                            </li>
                        </ul>
                        <div className={styles.burger} onClick={navSlide}>
                            <div className={isOpen ? styles.line1CloseBtn : ""}></div>
                            <div className={isOpen ? styles.line2CloseBtn : ""}></div>
                            <div className={isOpen ? styles.line3CloseBtn : ""}></div>
                        </div>
                    </div> 
                    :
                    <div></div>
                }
                
            </div>
        </nav>
    )
}

Nav.propTypes = {
    updateAuthState: PropTypes.func.isRequired, 
    isLoggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    isLoggedIn: state.authState.isLoggedIn
});

export default connect(mapStateToProps, {updateAuthState})(Nav);