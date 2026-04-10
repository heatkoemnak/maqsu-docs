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
          <img width={25} className={styles.logoImage} src={logo} alt="Maqsu Logo" />
        </Link>

        <div className={styles.searchContainer}>
          <Search />
        </div>

        <div className={styles.navLinks}>
          <Link to="/support" className={styles.navItem}>
            <span>Support</span>
          </Link>
          <Link to="https://maqsu.com/en/blog" className={styles.navItem}>
            <span>Blog</span>
          </Link>
        <div className={styles.languageSelector}>
          <svg viewBox="-1.565 -1.565 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" id="Global--Streamline-Solar-Ar" height={17} width={17} ><desc>{"\n    Global Streamline Icon: https://streamlinehq.com\n  "}</desc><path d="M42.96416666666667 23.435000000000002c0 2.564570166666667 -0.5052195416666667 5.1041430000000005 -1.4865601666666668 7.473421500000001 -0.9815359166666668 2.369473791666667 -2.419859041666667 4.522369125000001 -4.233337458333334 6.335847541666667 -1.8134784166666669 1.8134784166666669 -3.9663737500000007 3.251801541666667 -6.335847541666667 4.233337458333334C28.539143000000003 42.458947125 25.99957016666667 42.96416666666667 23.435000000000002 42.96416666666667c-2.564570166666667 0 -5.104103941666667 -0.5052195416666667 -7.473480087500001 -1.4865601666666668 -2.3693956750000003 -0.9815359166666668 -4.522271479166667 -2.419859041666667 -6.335730366666668 -4.233337458333334 -1.8134393583333335 -1.8134784166666669 -3.2519577750000006 -3.9663737500000007 -4.233396045833334 -6.335847541666667C4.410974758333333 28.539143000000003 3.9058333333333337 25.99957016666667 3.9058333333333337 23.435000000000002c0 -2.564570166666667 0.505141425 -5.104103941666667 1.4865796958333335 -7.473499616666667 0.9814187416666668 -2.3693761458333333 2.4199371583333336 -4.522251950000001 4.2333765166666675 -6.335710837500001 1.8134588875000002 -1.8134393583333335 3.966334691666667 -3.2519577750000006 6.335730366666668 -4.233396045833334C18.330896058333334 4.410974758333333 20.870429833333336 3.9058333333333337 23.435000000000002 3.9058333333333337c2.564570166666667 0 5.1041430000000005 0.505141425 7.473421500000001 1.4865796958333335 2.369473791666667 0.9814187416666668 4.522369125000001 2.4199371583333336 6.335847541666667 4.2333765166666675 1.8134784166666669 1.8134588875000002 3.251801541666667 3.966334691666667 4.233337458333334 6.335730366666668C42.458947125 18.330896058333334 42.96416666666667 20.870429833333336 42.96416666666667 23.435000000000002Z" stroke="#ffffff" strokeWidth={3.13} /><path d="M31.24666666666667 23.435000000000002c0 2.564570166666667 -0.202126875 5.1041430000000005 -0.5946631250000001 7.473421500000001 -0.3925362500000001 2.369473791666667 -0.9678655 4.522369125000001 -1.6933740416666667 6.335847541666667 -0.7253132500000001 1.8134784166666669 -1.5865495000000003 3.251801541666667 -2.534299958333334 4.233337458333334C25.476579083333338 42.458947125 24.460867125 42.96416666666667 23.435000000000002 42.96416666666667c-1.025867125 0 -2.0415790833333336 -0.5052195416666667 -2.9893295416666668 -1.4865601666666668 -0.9478285750000001 -0.9815359166666668 -1.8089671791666668 -2.419859041666667 -2.5343585458333338 -4.233337458333334 -0.7253718375 -1.8134784166666669 -1.3007792041666668 -3.9663737500000007 -1.6933545125000002 -6.335847541666667C15.825382091666668 28.539143000000003 15.623333333333335 25.99957016666667 15.623333333333335 23.435000000000002c0 -2.564570166666667 0.20204875833333336 -5.104103941666667 0.5946240666666667 -7.473499616666667 0.3925753083333334 -2.3693761458333333 0.9679826750000001 -4.522251950000001 1.6933545125000002 -6.335710837500001 0.7253913666666667 -1.8134393583333335 1.5865299708333334 -3.2519577750000006 2.5343585458333338 -4.233396045833334C21.393420916666667 4.410974758333333 22.409132875000005 3.9058333333333337 23.435000000000002 3.9058333333333337c1.025867125 0 2.0415790833333336 0.505141425 2.9893295416666668 1.4865796958333335 0.9477504583333335 0.9814187416666668 1.8089867083333335 2.4199371583333336 2.534299958333334 4.2333765166666675 0.7255085416666668 1.8134588875000002 1.300837791666667 3.966334691666667 1.6933740416666667 6.335730366666668C31.04453979166667 18.330896058333334 31.24666666666667 20.870429833333336 31.24666666666667 23.435000000000002Z" stroke="#ffffff" strokeWidth={3.13} /><path d="M3.9058333333333337 23.435000000000002h39.05833333333334" stroke="#ffffff" strokeLinecap="round" strokeWidth={3.13} /></svg>
            <span>English (United States)</span>
        </div>
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
