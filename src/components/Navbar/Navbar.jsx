import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import Link from '@docusaurus/Link'
import logo from '../../../static/img/maqsu-logo.png'
import Search from '../Search'
import styles from './styles.module.css'
import {HiMenuAlt3, HiX} from 'react-icons/hi'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    const handleResize = () => {
      if (window.innerWidth > 1180) {
        setIsMobileMenuOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEsc)
    window.addEventListener('resize', handleResize)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEsc)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={clsx(styles.navbarRoot, isScrolled && styles.scrolled)}>
      <nav className={styles.navbarWrapper}>
        <Link to="/" className={styles.logoLink}>
          <img className={styles.logoImage} src={logo} alt="Maqsu Logo" />
        </Link>

        <div className={styles.searchContainer}>
          <Search />
        </div>

        <div className={styles.navLinks}>
          <Link to="https://maqsu.com/en/blog" className={styles.navItem}>
            <span>Blog</span>
          </Link>
        </div>

        <button
          type="button"
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={clsx(styles.mobileMenu, isMobileMenuOpen && styles.open)}
        aria-hidden={!isMobileMenuOpen}
      >
        <button
          type="button"
          className={styles.mobileMenuBackdrop}
          onClick={closeMobileMenu}
          aria-label="Close mobile menu"
        />

        <aside className={styles.mobileMenuPanel}>
          <div className={styles.mobileMenuHeader}>
            <Link to="/" className={styles.mobileMenuLogo} onClick={closeMobileMenu}>
              <img className={styles.logoImage} src={logo} alt="Maqsu Logo" />
            </Link>
            <button
              type="button"
              className={styles.mobileMenuClose}
              onClick={closeMobileMenu}
              aria-label="Close mobile menu"
            >
              <HiX size={24} />
            </button>
          </div>

          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileSearch}>
              <Search />
            </div>

            <div className={styles.mobileLinks}>
              <Link
                to="https://maqsu.com/en/blog"
                className={styles.mobileNavItem}
                onClick={closeMobileMenu}
              >
                Blog
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </header>
  )
}
