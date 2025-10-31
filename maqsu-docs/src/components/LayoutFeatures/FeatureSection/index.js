import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import {
  HiHome,
  HiMiniChevronDown,
  HiMiniChevronLeft,
  HiMiniChevronRight,
} from "react-icons/hi2";
import { MdLibraryBooks } from "react-icons/md";
import { PiNote } from "react-icons/pi";
import { TbExternalLink } from "react-icons/tb";
import { CgNotes } from "react-icons/cg";
import { motion } from "framer-motion";
import { TinaMarkdown } from "tinacms/dist/rich-text";

const gettingStartedData = require("../../../../config/gettstarted/index.json");
const salesData = require("../../../../config/sales/index.json");
const purchaseData = require("../../../../config/purchase/index.json");
const accountingData = require("../../../../config/accounting/index.json");
const inventoryData = require("../../../../config/inventory/index.json");
const homeData = require("../../../../config/homepage/index.json");
const settingsData = require("../../../../config/settings/index.json");

// ========================================================
// Right Section
// ========================================================
const RightSection = ({
  idx,
  link,
  image,
  title,
  description,
  source,
  items = [],
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleExpand = (e) => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, x: 10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration: 0.5,
        delay: idx * 0.1,
        ease: "easeOut",
      }}
      className={clsx("row", styles.card, expanded && styles.cardExpanded)}
    >
      <div onClick={toggleExpand} className={clsx(styles.cardLink)}>
        <div className="flex items-center gap-3">
          {image && (
            <div className="text--center">
              <img className={styles.featureSvg} src={image} role="img" />
            </div>
          )}

          <div
            className={clsx("text--center padding-horiz--md", styles.cardContent)}
          >
            <div className={clsx(styles.toggleButton)}>
              <Link to={link} className={styles.titleLink}>
                <div className={clsx(styles.title)}>
                  <div>
                    {/* <CgNotes size={17} /> */}
                    <PiNote size={22} />
                  </div>
                  <div>{title && <span>{title}</span>}</div>
                </div>
                {/* <div>
                  <TbExternalLink size={25} color="teal" className={clsx(styles.icon)} />
                </div> */}
              </Link>
            </div>

            {items.length > 0 && (
              <div className={clsx(styles.articalCount)}>
                {!expanded && items?.length > 0 && (
                  <div className={styles.expandableContentRow}>
                    {items
                      ?.slice(0, 4)
                      .map((item) => (
                        <Link
                          key={item?.title}
                          href={`${source}/${item.link}`}
                          className="block text-gray-700 hover:text-emerald-600"
                        >
                          <div className={clsx(styles.expandableLink)}>
                            {item?.title || item.name}
                            <TbExternalLink color="teal" />
                          </div>
                        </Link>
                      ))}

                    {items.length > 4 && (
                      <div className="text-gray-500 text-sm mt-1">…</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {items?.length > 0 && (
          <div>
            {expanded ? (
              <HiMiniChevronDown size={30} />
            ) : (
              <HiMiniChevronRight size={30} />
            )}
          </div>
        )}
      </div>

      {expanded && items?.length > 0 && (
        <div className={styles.expandableContentCol}>
          {items?.map((item) => (
            <Link
              key={item?.title}
              href={`${source}/${item.link}`}
              className="block text-gray-700 hover:text-emerald-600"
            >
              <div className={clsx(styles.expandableLink)}>
                {item?.title || item.name}
                <TbExternalLink color="teal" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ========================================================
// Left Section
// ========================================================
const LeftSection = ({ image, title, description }) => (
  <div className={clsx("col col--12", styles.card)}>
    {image && (
      <div className="text--center">
        <img className={styles.featureSvg} src={image} role="img" />
      </div>
    )}

    <div className={clsx("text--center padding-horiz--md", styles.cardContent)}>
      {title && <h2 className="text--center">{title}</h2>}
      <hr />
      {description && <p className="text--center">{description}</p>}
    </div>
  </div>
);

// ========================================================
// Feature Sections
// ========================================================
export const FeatureSections = ({ data, index }) => {
  const location = useLocation();
  const [pageData, setPageData] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6; // 👈 number of cards per page

  React.useEffect(() => {
    try {
      if (location.pathname === "/getting-started") setPageData(gettingStartedData);
      else if (location.pathname === "/sales") setPageData(salesData);
      else if (location.pathname === "/purchase") setPageData(purchaseData);
      else if (location.pathname === "/accounting") setPageData(accountingData);
      else if (location.pathname === "/inventory") setPageData(inventoryData);
      else if (location.pathname === "/settings") setPageData(settingsData);
      else setPageData(homeData);
    } catch (err) {
      console.error("Error loading page data:", err);
    }
  }, [location.pathname]);

  // ✅ Find "features" block and its items
  const featureBlock = homeData.blocks.find((b) => b._template === "features");
  const items = featureBlock?.items || [];

  // ✅ Find current item index for page navigation
  const currentIndex = items.findIndex((item) => `/${item.link}` === location.pathname);
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  // ✅ Pagination logic for RightSection cards
  const totalPages = Math.ceil(data.items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleCards = data.items.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <section key={index} className={styles.features}>
      {/* ✅ Page Navigation Controls */}
      <div className={clsx("container text--left margin-bottom--lg", styles.pageNavigation)}>
        {prevItem ? (
          <Link to={`/${prevItem.link}`} className={clsx(styles.prev_navigation)}>
            <span>
              <HiMiniChevronLeft size={25} />
              {prevItem.title}
            </span>
          </Link>
        ) : (
          <Link
            to={`/`}
            className={clsx("margin-right--sm justify-content--flex-center align-items--center", styles.paginationLink)}
          >
            <HiHome size={20} /> All Categories
          </Link>
        )}
        {nextItem && (
          <Link to={`/${nextItem.link}`} className={clsx(styles.button_navigation)}>
            <span>
              {nextItem.title} <HiMiniChevronRight size={25} />
            </span>
          </Link>
        )}
      </div>
      {/* ✅ Pagination controls under card list */}
      {totalPages > 1 && (
        <div className={clsx("margin-top--lg text--right", styles.paginationContainer)}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={clsx(styles.paginationButton, currentPage === 1 && styles.disabled)}
          >
            <HiMiniChevronLeft size={20} />
          </button>

          <span className={clsx(styles.paginationText)}>
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={clsx(styles.paginationButton, currentPage === totalPages && styles.disabled)}
          >
            <HiMiniChevronRight size={20} />
          </button>
        </div>
      )}


      <div className={clsx("container", styles.container_section)}>
        {/* Left Section */}
        <div className={clsx(styles.left_section)}>
          <LeftSection image={pageData?.image} title={pageData?.title} description={pageData?.description} />
        </div>


        {/* ✅ Right Section with Pagination */}
        <div className={clsx("row", styles.right_section)}>
          {visibleCards.map((props, idx) => (
            <RightSection
              key={startIndex + idx}
              idx={startIndex + idx}
              {...props}
              source={location?.pathname}
              items={props.items}
            />
          ))}
          
        </div>


      </div>
    </section>
  );
};