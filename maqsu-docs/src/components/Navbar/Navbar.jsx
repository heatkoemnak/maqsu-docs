import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import logo from '../../../static/img/maqsu-logo.png'
import Link from '@docusaurus/Link'
import Search from '../Search'
import styled from 'styled-components'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <StyledNavbar className={clsx(isScrolled && 'scrolled')}>
      <nav className={clsx(styles.navbarContainer, 'navbar-wrapper')}>
        {/* Logo Section */}
        <Link to='/' className={clsx(styles.logoContainer, 'logo-link')}>
          <img className={clsx(styles.logo, 'logo-image')} src={logo} alt="Maqsu Logo" />
        </Link>

        {/* Search Section - Desktop */}
        <div className={clsx(styles.div1, 'search-container')}>
          <Search/>
        </div>

        {/* Navigation Links - Desktop */}
        <div className={clsx(styles.rightSide, 'nav-links')}>
          <Link to="https://maqsu.com/en/blog" className={clsx(styles.navLink, 'nav-item')}>
            <span>Blog</span>
          </Link>
          {/* <Link to="#contact" className={clsx(styles.navLink, 'nav-item')}>
            <span>Contact</span>
          </Link> */}
          <Link to="/getting-started" className="cta-button">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={clsx('mobile-menu', isMobileMenuOpen && 'open')}>
        <div className="mobile-menu-content">
          <div className="mobile-search">
            <Search/>
          </div>
          <div className="mobile-links">
            <Link
              to="#home"
              className="mobile-nav-item"
              onClick={toggleMobileMenu}
            >
              Blog
            </Link>
            {/* <Link
              to="#contact"
              className="mobile-nav-item"
              onClick={toggleMobileMenu}
            >
              Contact
            </Link> */}
            <Link
              to="/getting-started"
              className="mobile-cta-button"
              onClick={toggleMobileMenu}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </StyledNavbar>
  )
}

const StyledNavbar = styled.header`
  position: sticky;
  top: -60px;
  z-index: 1000;
  background: rgba(255, 255, 255);
  backdrop-filter: blur(10px);
  // -webkit-backdrop-filter: blur(10px);
  // border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);


  /* ─── Navbar Wrapper ─────────────────────────────────────────── */
  .navbar-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0 auto;
    padding: 0.5rem 5rem;
    gap: 2rem;
  }

  /* ─── Logo Section ─────────────────────────────────────────── */
  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  .logo-link:hover {
    transform: scale(1.05);
  }

  .logo-image {
    height: 30px;
    width: auto;
    object-fit: contain;
  }

  /* ─── Search Container ─────────────────────────────────────────── */
  .search-container {
    flex: 1;
    max-width: 500px;
    display: flex;
    align-items: center;
  }

  /* ─── Navigation Links ─────────────────────────────────────────── */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav-item {
    position: relative;
    text-decoration: none;
    color: #475569;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.3s ease;
    padding: 0.5rem 0;
  }

  .nav-item span {
    position: relative;
    z-index: 1;
  }

  .nav-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #385685 0%, #214e80 100%);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-item:hover {
    color: #3b82f6;
  }

  .nav-item:hover::after {
    width: 100%;
  }

  /* ─── CTA Button ─────────────────────────────────────────── */
  .cta-button {
    padding: 0.625rem 1.5rem;
    background: linear-gradient(135deg, #567ba3 0%, #3e3949 100%);
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 14px 4px 10px rgba(47, 75, 118, 0.3);
    white-space: nowrap;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  .cta-button:active {
    transform: translateY(0);
  }

  /* ─── Mobile Menu Button ─────────────────────────────────────────── */
  .mobile-menu-button {
    display: none;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #475569;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .mobile-menu-button:hover {
    background: #f1f5f9;
    color: #3b82f6;
  }

  .mobile-menu-button:active {
    transform: scale(0.95);
  }

  /* ─── Mobile Menu ─────────────────────────────────────────── */
  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
  }

  .mobile-menu.open {
    opacity: 1;
    visibility: visible;
  }

  .mobile-menu-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 2rem;
    padding: 2rem;
    transform: translateY(20px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
  }

  .mobile-menu.open .mobile-menu-content {
    transform: translateY(0);
  }

  .mobile-search {
    width: 100%;
    max-width: 400px;
  }

  .mobile-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

  .mobile-nav-item {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    position: relative;
  }

  .mobile-nav-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #050505 0%, #0b0713 100%);
    transition: width 0.3s ease;
  }

  .mobile-nav-item:hover {
    color: #60a5fa;
  }

  .mobile-nav-item:hover::after {
    width: 100%;
  }

  .mobile-cta-button {
    padding: 1rem 2.5rem;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    font-weight: 700;
    font-size: 1.125rem;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    margin-top: 1rem;
  }

  .mobile-cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(59, 130, 246, 0.5);
  }

  /* ─── Responsive Design ─────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .navbar-wrapper {
      padding: 1rem 1.5rem;
    }

    .search-container {
      max-width: 400px;
    }

    .nav-links {
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .navbar-wrapper {
      padding: 0.875rem 1rem;
      gap: 1rem;
    }

    .logo-image {
      height: 35px;
    }

    .search-container {
      display: none;
    }

    .nav-links {
      display: none;
    }

    .mobile-menu-button {
      display: flex;
    }
  }

  @media (max-width: 480px) {
    .navbar-wrapper {
      padding: 0.75rem 1rem;
    }

    .logo-image {
      height: 32px;
    }

    .mobile-nav-item {
      font-size: 1.25rem;
    }

    .mobile-cta-button {
      font-size: 1rem;
      padding: 0.875rem 2rem;
    }
  }

  /* ─── Dark Mode Support ─────────────────────────────────────────── */
  @media (prefers-color-scheme: dark) {
    background: rgba(15, 23, 42, 0.95);
    border-bottom-color: rgba(51, 65, 85, 0.8);

    &.scrolled {
      background: rgba(15, 23, 42, 0.98);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border-bottom-color: rgba(51, 65, 85, 1);
    }

    .nav-item {
      color: #cbd5e0;
    }

    .nav-item:hover {
      color: #60a5fa;
    }

    .mobile-menu-button {
      color: #cbd5e0;
    }

    .mobile-menu-button:hover {
      background: rgba(51, 65, 85, 0.8);
      color: #60a5fa;
    }
  }

  /* ─── Animations ─────────────────────────────────────────── */
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  animation: fadeInDown 0.5s ease-out;

  /* ─── Accessibility ─────────────────────────────────────────── */
  .nav-item:focus,
  .cta-button:focus,
  .mobile-menu-button:focus {
    // outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Disable animations for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;