import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import Link from '@docusaurus/Link'
import { useColorMode } from '@docusaurus/theme-common'
import logo from '../../../static/img/maqsu-logo.png'
import Search from '../Search'
import styles from './styles.module.css'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { BiFoodMenu } from 'react-icons/bi'
import { BookContext } from '../../context/BookContext'
import { Search as SearchIcon } from 'lucide-react'
import PopupSearch from '../Search/popup-search'
import ShowTopic from '../Search/show-topic'
import { IoChevronForwardOutline } from 'react-icons/io5'

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { colorMode, setColorMode } = useColorMode()
  const { toggleMenuOpen, endPath } = useContext(BookContext) || {}

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark')
  }

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
        <div className={styles.logoContainer}>
          {endPath && (
            <button type="button" className={styles.OpenMenuBook} onClick={toggleMenuOpen}>
              <BiFoodMenu size={24} />
            </button>
          )}


          <Link to="/" className={styles.logoLink}>
            <img width={25} className={styles.logoImage} src={logo} alt="Logo" />
          </Link>
         
        </div>

        <div className={styles.searchContainer}>
          <Search />
        </div>

        <div className={styles.navLinks}>
          <div onClick={toggleTheme} className={styles.themeToggleBtn}>
            <div className={styles.iconsWrapper}>
              {colorMode === 'dark' ? (
                <div>
                  Light
                  <SunIcon className={styles.mode_icon} />
                </div>
              ) : (
                <div>
                  <MoonIcon className={styles.mode_icon} /> Dark
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.mobileMenuControls}>
          <div onClick={setIsOpen} className={styles.pqMobileSearchIcon}>
            <SearchIcon size={20} className={styles.mobileMenuSearchIcon} />
          </div>
          <PopupSearch isOpen={isOpen} setIsOpen={setIsOpen} />

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
        </div>
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
            <button onClick={toggleTheme} className={styles.mobileThemeToggleBtn}>
              {colorMode === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>

            <Link to="/" className={styles.mobileMenuLogo} onClick={closeMobileMenu}>
              <img className={styles.logoImage} src={logo} alt="Maqsu Logo" />
            </Link>

            <button
              type="button"
              className={styles.mobileMenuClose}
              onClick={closeMobileMenu}
              aria-label="Close mobile menu"
            >
              <IoChevronForwardOutline size={20} />
            </button>
          </div>

          <div className={styles.mobileMenuContent}>
            <ShowTopic />
          </div>
        </aside>
      </div>
    </header>
  )
}