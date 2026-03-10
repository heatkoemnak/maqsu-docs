import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation } from "@docusaurus/router";

import { RiBarChart2Fill,RiBox3Fill, RiBankCardFill,RiBarChartBoxFill   } from "react-icons/ri";
export const Hero = ({ data, index }) => {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();

  // Example mapping based on pathname
  const getPageTitle = (pathname) => {
    if (pathname.startsWith("/sales")) return "Sales";
    if (pathname.startsWith("/purchase")) return "Purchase";
    if (pathname.startsWith("/inventory")) return "Inventory";
  // default fallbackage
    return data.title ? data.title : siteConfig.title;
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header
      key={index}
      className={clsx(styles.heroContainer)}
    >
      <div>
        <h1 className={clsx(styles.heroTitle)}>{pageTitle}</h1>
        <span className={clsx(styles.subTitle)}>We’ll guide you through our features with free tutorials, help articles, video and more.</span>

        <div className={clsx(styles.heroFeatures)}>
          <div>
            <Link to="/accounting" className={clsx(styles.heroDiv)}>
              <RiBarChart2Fill  size={28} />
              <span  className={clsx(styles.heroModuleTitle)}>Accounting</span >
            </Link>
          </div>
          <div>
            <Link to="/sales" className={clsx(styles.heroDiv)}>
              <RiBarChartBoxFill size={28} /><br></br>
              <span  className={clsx(styles.heroModuleTitle)}>Sales</span >
            </Link>
          </div>
          <div>
            <Link to="/purchase" className={clsx(styles.heroDiv)}>
            <RiBankCardFill  size={28} /><br></br>
            <span  className={clsx(styles.heroModuleTitle)}>Purchase</span >
            </Link>
          </div>
          <div>
            <Link to="/inventory" className={clsx(styles.heroDiv)}>
            <RiBox3Fill  size={28} /><br></br>
            <span  className={clsx(styles.heroModuleTitle)}>Inventory</span >
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

