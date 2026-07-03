import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearExtensionAuth } from '../extensionAuth';
import './Navbar.css';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearExtensionAuth();
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    navigate('/home');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/home" onClick={closeMobileMenu}>
          <span className="brand-mark" />
          <span>DSA Tracker</span>
        </Link>
      </div>

      <button
        className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="nav-group nav-links">
          <a href="/home#features" onClick={closeMobileMenu}>
            Features
          </a>
          <Link to="/analytics" className={isActive('/analytics') ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>
            Analytics
          </Link>
          <a href="/home#pricing" onClick={closeMobileMenu}>
            About
          </a>
          {/* <a href="/home#about" onClick={closeMobileMenu}>
            About
          </a> */}
        </div>

        <div className="nav-group nav-actions">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className={isActive('/profile') ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
              <button className="nav-button nav-button-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={isActive('/login') ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link to="/signup" className="nav-button nav-button-primary" onClick={closeMobileMenu}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
