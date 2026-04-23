import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

export default function Footer() {
  return (
    <footer className={styles.footerRoot}>
      <div className={styles.footerContainer}>
        <div className={styles.footerRow}>
          {/* Contact Section */}
          <div className={styles.footerCol}>
            <span className={styles.colTitle}>Contact Us</span>
            <ul className={styles.linkList}>
              <li>
                <i className="fa fa-envelope"></i> 
                <span>info@maqsu.com</span>
              </li>
              <li>
                <i className="fa fa-phone"></i> 
                <span>+91-7291007617</span>
              </li>
              <li>
                <i className="fa fa-map-marker"></i> 
                <span>FF 11 A, Sunrise Mall, Sector 11, Vasundhara, Ghaziabad Delhi NCR</span>
              </li>
            </ul>
          </div>

          {/* Empty spacer for layout parity if needed, otherwise removed */}
          <div className={styles.footerCol}>
            {/* Reserved for additional links or info */}
          </div>

          {/* Policies Section */}
          <div className={styles.footerCol}>
            <span className={styles.colTitle}>Terms & Policies</span>
            <nav>
              <ul className={styles.linkList}>
                <li>
                  <a href="#" className={styles.footerLink}>Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>Terms & Conditions</a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>Refund Policy</a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>Disclaimer Policy</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>
            &copy; {new Date().getFullYear()} Maqsu | All Rights Reserved
          </div>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialIcon} aria-label="Facebook">
              <i className="fa fa-facebook-official"></i>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter">
              <i className="fa fa-twitter-square"></i>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Github">
              <i className="fa fa-github-square"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
