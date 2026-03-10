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
import { MdGridView, MdLibraryBooks } from "react-icons/md";
import { PiInfo, PiNote } from "react-icons/pi";
import { TbExternalLink } from "react-icons/tb";
import { CgNotes } from "react-icons/cg";
import { motion } from "framer-motion";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { PiPlusCircleLight } from "react-icons/pi";
import { RiListCheck2 } from "react-icons/ri";
import { LiaAngleRightSolid } from "react-icons/lia";
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
const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : ""
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration: 0.1,
        delay: idx * 0.1,
        ease: "easeOut",
      }}
      className={clsx(styles.categoriesList, expanded && styles.cardExpanded)}
    >
      <div className={clsx(styles.cardLink)}>
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
              <a href={`${link}`} className={styles.titleLink}>
                <div className={clsx(styles.titleContainer)}>
                  <div className={clsx(styles.iconNote)}>
                    {/* <CgNotes color="#1a4569" size={17} /> */}
                    <PiNote fill="#276292" size={19} />
                  </div>
                    <span className={styles.title4}>{title}</span>
                </div>

                {/* <div>
                  <TbExternalLink size={25} color="teal" className={clsx(styles.icon)} />
                </div> */}
              </a>

            </div>

            {items.length > 0 && (
              <div className={clsx(styles.articalCount)}>
                {!expanded && items?.length > 0 && (
                  <div className={styles.expandableContentRow}>
                    {items
                      ?.slice(0, 3)
                      .map((item) => (
                        <Link
                          key={item?.title}
                          href={`${source}/${item.link}`}
                          className={clsx(styles.Link)}
                        >
                          <div className={clsx(styles.expandableLink)}>
                            {item?.title || item.name}

                            {/* <TbExternalLink color="teal" /> */}
                          </div>

                        </Link>
                      ))}
                      {items.length > 3 && (
                      <div className="text-gray-500 text-sm mt-1"><span className={clsx(styles.more)}>{items.length -3}+ <span>More</span></span></div>
                      // <PiPlusCircleLight />
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
  <div className={clsx("col col--12")}>
    {/* {image && (
      <div className="text--center">
        <img className={styles.featureSvg} src={image} role="img" />
      </div>
    )} */}

    <div className={clsx(styles.Definition)}>
        <div className="text--center">
        <div className="text--center">
           <PiInfo  fill="#276292"  size={21} />
        </div>
         <span>{title}</span>
         <hr className={clsx(styles.hr)}/>
        </div>
      {description && <span className={clsx(styles.description)}>{description}</span>}
    </div>
  </div>
);

// ========================================================
// Feature Sections
// ========================================================
export const FeatureSections = ({ data, index }) => {
  console.log(data);
  const location = useLocation();
  const [pageData, setPageData] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8; // 👈 number of cards per page
  const [gridView, setGridView] = React.useState(true);
  console.log(pageData);

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
      <div className={clsx(styles.breadcrumb)}>
        <div className={clsx(styles.breadcrumbLeft)}>
            <Link href="/" className={clsx(styles.breadcrumbLink)}>All Categories</Link>
            <LiaAngleRightSolid size={13} />
            <span>{pageData?.title}</span>
        </div>

        <div className={clsx(styles.breadcrumbRight)}>
          <div className={clsx(styles.pagination)}>
            {totalPages > 1 && (
              <div className={clsx(styles.paginationContainer)}>
                <div className={clsx(styles.paginationButton,currentPage > 1 && styles.Paginationbutton)}>
                  <HiMiniChevronLeft onClick={handlePrevPage} size={20} />
                </div>

                <span className={clsx(styles.paginationText)}>
                  Page {currentPage} / {totalPages}
                </span>
                <div className={clsx(styles.paginationButton,currentPage < totalPages && styles.Paginationbutton)}>
                  <HiMiniChevronRight onClick={handleNextPage} size={20} />
                </div>
              </div>
            )}
          </div>
          <div className={clsx(styles.display_view_container)}>
              <RiListCheck2 onClick={() => setGridView(false)} size={20} className={clsx(`${gridView ? styles.inactive_icon : styles.active_icon}`)} />
              <MdGridView onClick={() => setGridView(true)} size={20} className={clsx(`${gridView ? styles.active_icon : styles.icon_1}`)} />
          </div>
        </div>
      </div>
      <div className={clsx(styles.container_section)}>
        <div className={clsx(styles.left_section)}>
          <LeftSection image={pageData?.image} title={pageData?.title} description={pageData?.description} />
        </div>

        {/* Right section with pagination */}
        <div className={clsx( styles.right_section)}>
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

      {/* Pagination controls under card list */}
      {/* {totalPages > 1 && (
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
      )} */}
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
    </section>
  );
};