import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import { getDocPath, titleFromSlug } from "../../../util";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Search from "../Search";
import { useLocation } from "@docusaurus/router";

export const HeroContent = ({ data, index }) => {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  console.log("pathname:",location.pathname);

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
    >
      <div className="container">
        <Search title={pageTitle} />
      </div>
    </header>
  );
};
