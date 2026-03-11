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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
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
          <Link to="/getting-started" className={styles.ctaButton}>
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </nav>

      <div className={clsx(styles.mobileMenu, isMobileMenuOpen && styles.open)}>
        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileSearch}>
            <Search />
          </div>
          <div className={styles.mobileLinks}>
            <Link
              to="https://maqsu.com/en/blog"
              className={styles.mobileNavItem}
              onClick={toggleMobileMenu}
            >
              Blog
            </Link>
            <Link
              to="/getting-started"
              className={styles.mobileCtaButton}
              onClick={toggleMobileMenu}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

