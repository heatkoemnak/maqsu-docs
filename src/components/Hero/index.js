import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation } from "@docusaurus/router";
import accountingIcon from "../../../static/img/icon/acc.png";
import SalesIcon from "../../../static/img/icon/sales.png";
import PurchaseIcon from "../../../static/img/icon/purchase.png";
import InventoryIcon from "../../../static/img/icon/inventory.png";

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
      <div className={clsx(styles.heroInner)}>
        <h1 className={clsx(styles.heroTitle)}>{pageTitle}</h1>
        <span className={clsx(styles.subTitle)}>We'll guide you through our features with free tutorials, help articles, video and more.</span>

        <div className={clsx(styles.heroFeatures)}>
          <div>
            <Link to="/accounting" className={clsx(styles.heroDiv)}>
              {/* <RiBarChart2Fill  size={28} /> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Finance-Mode-Fill--Streamline-Sharp-Fill-Material" height={23} width={23} ><desc>{"\n    Finance Mode Fill Streamline Icon: https://streamlinehq.com\n  "}</desc><path fill="#254961" d="M7.95 13.5V6.125h2.25V13.5l-1.125 -1.125L7.95 13.5Zm4.85 2.275V2h2.25v11.525l-2.25 2.25Zm-9.7 2.5v-8h2.25v5.75l-2.25 2.25ZM3 21.05l6.15 -6.15 3.725 3.3 6.55 -6.55h-2.2v-1.5H22v4.75h-1.5v-2.2L12.925 20.275 9.2 17l-4.05 4.05H3Z" strokeWidth={0.5} /></svg>
              <span  className={clsx(styles.heroModuleTitle)}>Accounting</span >
            </Link>
          </div>
          <div>
            <Link to="/sales" className={clsx(styles.heroDiv)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 300 300" id="Insert-Chart--Streamline-Rounded-Material" height={24} width={24} ><desc>{"\n    Insert Chart Streamline Icon: https://streamlinehq.com\n  "}</desc><path fill="#34566d" d="M56.25 262.5c-5 0 -9.375 -1.875 -13.125 -5.625 -3.75 -3.75 -5.625 -8.125 -5.625 -13.125V56.25c0 -5 1.875 -9.375 5.625 -13.125C46.875 39.375 51.24999999999999 37.5 56.25 37.5h187.5c5 0 9.375 1.875 13.125 5.625 3.75 3.75 5.625 8.125 5.625 13.125v187.5c0 5 -1.875 9.375 -5.625 13.125 -3.75 3.75 -8.125 5.625 -13.125 5.625H56.25Zm0 -18.75h187.5V56.25H56.25v187.5Zm41.81875 -116.25000000000001c-2.6706250000000002 0 -4.891875 0.898125 -6.6625000000000005 2.69375 -1.770625 1.798125 -2.65625 4.025 -2.65625 6.6812499999999995v67.1875c0 2.65625 0.9043749999999999 4.8825 2.7125 6.678125 1.80625 1.798125 4.045625 2.696875 6.71875 2.696875 2.6706250000000002 0 4.891875 -0.89875 6.6625000000000005 -2.696875 1.770625 -1.795625 2.65625 -4.021875 2.65625 -6.678125V136.875c0 -2.65625 -0.9043749999999999 -4.883125 -2.7125 -6.6812499999999995 -1.80625 -1.795625 -4.045625 -2.69375 -6.71875 -2.69375Zm51.87500000000001 -40.9375c-2.6706250000000002 0 -4.891875 0.898125 -6.6625000000000005 2.69375 -1.770625 1.798125 -2.65625 4.025 -2.65625 6.6812499999999995v108.125c0 2.65625 0.9043749999999999 4.8825 2.7125 6.678125 1.80625 1.798125 4.045625 2.696875 6.71875 2.696875 2.6706250000000002 0 4.891875 -0.89875 6.6625000000000005 -2.696875 1.770625 -1.795625 2.65625 -4.021875 2.65625 -6.678125v-108.125c0 -2.65625 -0.9043749999999999 -4.883125 -2.7125 -6.6812499999999995 -1.80625 -1.795625 -4.045625 -2.69375 -6.71875 -2.69375Zm51.87500000000001 80.625c-2.6706250000000002 0 -4.891875 0.898125 -6.6625000000000005 2.69375 -1.770625 1.798125 -2.65625 4.025 -2.65625 6.6812499999999995v27.500000000000004c0 2.65625 0.9043749999999999 4.8825 2.7125 6.678125 1.80625 1.798125 4.045625 2.696875 6.71875 2.696875 2.6706250000000002 0 4.891875 -0.89875 6.6625000000000005 -2.696875 1.770625 -1.795625 2.65625 -4.021875 2.65625 -6.678125v-27.500000000000004c0 -2.65625 -0.9043749999999999 -4.883125 -2.7125 -6.6812499999999995 -1.80625 -1.795625 -4.045625 -2.69375 -6.71875 -2.69375Z" strokeWidth={9.25} /></svg>
              {/* <RiBarChartBoxFill size={28} /> */}
              <span  className={clsx(styles.heroModuleTitle)}>Sales</span >
            </Link>
          </div>
          <div>
            <Link to="/purchase" className={clsx(styles.heroDiv)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Credit-Card-1--Streamline-Core" height={20} width={24} ><desc>{"\n    Credit Card 1 Streamline Icon: https://streamlinehq.com\n  "}</desc><g id="credit-card-1--credit-pay-payment-debit-card-finance-plastic-money-atm"><path id="Vector" stroke="#34566d" strokeLinecap="round" strokeLinejoin="round" d="M12.5 2.25h-11c-0.552285 0 -1 0.44772 -1 1v7.5c0 0.5523 0.447715 1 1 1h11c0.5523 0 1 -0.4477 1 -1v-7.5c0 -0.55228 -0.4477 -1 -1 -1Z" strokeWidth={1} /><path id="Vector_2" stroke="#34566d" strokeLinecap="round" strokeLinejoin="round" d="M0.5 5.75h13" strokeWidth={1} /><path id="Vector_3" stroke="#34566d" strokeLinecap="round" strokeLinejoin="round" d="M9.5 9.25H11" strokeWidth={1} /></g></svg>
            {/* <RiBankCardFill  size={28} /> */}
            <span  className={clsx(styles.heroModuleTitle)}>Purchase</span >
            </Link>
          </div>
          <div>
            <Link to="/inventory" className={clsx(styles.heroDiv)}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#34566d" strokeLinecap="round" strokeLinejoin="round" id="Package--Streamline-Lucide" height={24} width={23} ><desc>{"\n    Package Streamline Icon: https://streamlinehq.com\n  "}</desc><path d="m7.5 4.27 9 5.15" strokeWidth={1.5} /><path d="M21 8a2 2 0 0 0 -1 -1.73l-7 -4a2 2 0 0 0 -2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7 -4A2 2 0 0 0 21 16Z" strokeWidth={1.5} /><path d="m3.3 7 8.7 5 8.7 -5" strokeWidth={1.5} /><path d="M12 22V12" strokeWidth={1.5} /></svg>
            {/* <RiBox3Fill  size={28} /> */}
            <span  className={clsx(styles.heroModuleTitle)}>Inventory</span >
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

