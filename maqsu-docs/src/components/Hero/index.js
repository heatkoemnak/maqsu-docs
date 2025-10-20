import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import { getDocPath, titleFromSlug } from "../../../util";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Search from "../Search";
import { useLocation } from "@docusaurus/router";

export const Hero = ({ data, index }) => {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();

  // Example mapping based on pathname
  const getPageTitle = (pathname) => {
    if (pathname.startsWith("/sales")) return "Sales";
    if (pathname.startsWith("/purchase")) return "Purchase";
    if (pathname.startsWith("/inventory")) return "Inventory";
    // default fallback
    return data.title ? data.title : siteConfig.title;
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header
      key={index}
      className={clsx("hero hero--primary", styles.heroBanner)}
    >
      <div className="container">
        <h1 className="hero__title">{pageTitle}</h1>

        {data.document && data.documentLabel && (
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to={getDocPath(data.document)}
            >
              {data.documentLabel
                ? data.documentLabel
                : titleFromSlug(data.document)}
            </Link>
          </div>
        )}

        <Search title={pageTitle} />
      </div>
    </header>
  );
};
