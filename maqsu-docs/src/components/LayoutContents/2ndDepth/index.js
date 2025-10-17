import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { HiHome, HiMiniChevronDown, HiMiniChevronLeft,HiMiniChevronRight } from "react-icons/hi2";
import { MdLibraryBooks } from "react-icons/md";
import { TbExternalLink } from "react-icons/tb";
const gettingStartedData = require("../../../../config/gettstarted/index.json");
const salesData = require("../../../../config/sales/index.json");
const purchaseData = require("../../../../config/purchase/index.json");
const accountingData = require("../../../../config/accounting/index.json");
const inventoryData = require("../../../../config/inventory/index.json");
const homeData = require("../../../../config/homepage/index.json");
const settingsData = require("../../../../config/settings/index.json");
import { motion } from "framer-motion";

const RightSection = ({idx, link, image, title, description, items = [] }) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleExpand = (e) => {
    e.preventDefault(); // prevent navigation
    setExpanded(!expanded);
  };

  return (
    <motion.div
            initial={{ opacity: 0, y: 30,x:10 }}
            animate={{ opacity: 1, y: 0,x: 0 }}
            transition={{
              duration: 0.5,
              delay: idx * 0.1, // stagger animation
              ease: "easeOut",
            }} className={clsx("row", styles.card,expanded && styles.cardExpanded)}>
       <div
        onClick={toggleExpand}
        className={clsx(
          styles.cardLink )}
      >
        <div className="flex items-center gap-3">
          {image && (
            <div className="text--center">
              <img className={styles.featureSvg} src={image} role="img" />
            </div>
          )}
          <div
            className={clsx(
              "text--center padding-horiz--md",
              styles.cardContent
            )}
          >

            <div className={clsx(styles.toggleButton)}>
            <Link to={link} className={styles.titleLink}>
             {title && <h2>{title}</h2>} <div><TbExternalLink size={25} color="teal" className={clsx(styles.icon)} /></div>
            </Link>
            </div>
            {/* <TinaMarkdown content={description} /> */}
            {/* {description && ( */}
              <p>
                <FormattedText text={description} expanded={expanded} />
                <ToggleTextButton
                    expanded={expanded}
                    description={description}
                    title="details"
                    onClick={() => setExpanded(!expanded)}
                  />
                </p>
            {/* )} */}
            {
              items.length> 0&&(
                <div className={clsx(styles.articalCount)}>
                  <MdLibraryBooks /> {items?.length} {items?.length === 1 ? "artical" : "articals"} |
                  {!expanded && items?.length > 0 && (
                    <div className={styles.expandableContentRow}>
                      {items
                        ?.slice(0, 3) // ✅ Show only first 3 items
                        .map((item) => (
                          <Link
                            key={item?.title}
                            href={`/${link}/${item.title}`}
                            className="block text-gray-700 hover:text-emerald-600"
                          >
                            <div className={clsx(styles.expandableLink)}>
                              {item?.title || item.name}
                              <TbExternalLink color="teal" />
                            </div>
                          </Link>
                        ))}

                      {/* ✅ If more than 3, show "..." */}
                      {items.length > 3 && (
                        <div className="text-gray-500 text-sm mt-1">…</div>
                      )}
                    </div>
                  )}
                </div>
              )
            }
          </div>
        </div>
          {items?.length > 0 &&
            <div>
              {expanded ? (
                <HiMiniChevronDown size={30} />
              ) : (
                <HiMiniChevronRight size={30} />
              )}
            </div>
          }
      </div>

      {/* Expandable content */}
      {expanded && items?.length > 0 && (
        <div className={styles.expandableContentCol}>
        {/* <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-300 pl-3"> */}
          {items?.map((item) => (
            <Link
              key={item?.title}
              href={`/${link}/${item.title}`}
              className="block text-gray-700 hover:text-emerald-600"
            >
              <div className={clsx(styles.expandableLink)}>
               {item?.title || item.name}<TbExternalLink  color="teal"/>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};


const LeftSection = ({ image, title, description,items }) => (
  <div className={clsx("col col--12", styles.card)}>
    {image && (
      <div className="text--center">
        <img className={styles.featureSvg} src={image} role="img" />
      </div>
    )}
    <div className={clsx("text--center padding-horiz--md", styles.cardContent)}>
      {title && <h2 className="text--center">{title}</h2>}
      <hr />
       {
              items.length> 0&&(
                <div className={clsx(styles.articalCount)}>
                  <MdLibraryBooks /> {items?.length} {items?.length === 1 ? "artical" : "articals"}
                </div>
              )
            }
    </div>
  </div>
);

export const FeatureSections = ({data, index }) => {
  console.log(data);
  const location = useLocation();
  const [pageData, setPageData] = React.useState(null);

  React.useEffect(() => {
    try {
      if (location.pathname === "/getting-started") {
        setPageData(gettingStartedData);
      } else if (location.pathname === "/sales") {
        setPageData(salesData);
      } else if (location.pathname === "/purchase") {
        setPageData(purchaseData);
      } else if (location.pathname === "/accounting") {
        setPageData(accountingData);
      } else if (location.pathname === "/inventory") {
        setPageData(inventoryData);
      } else if (location.pathname === "/settings") {
        setPageData(settingsData);
      } else {
        setPageData(homeData);
      }
    } catch (err) {
      console.error("Error loading page data:", err);
    }
  }, [location.pathname]);

  // ✅ Find "features" block and all its items (navigation order)
  const featureBlock = homeData.blocks.find((b) => b._template === "features");
  const items = featureBlock?.items || [];

  // ✅ Find current page index
  const currentIndex = items.findIndex(
    (item) => `/${item.link}` === location.pathname
  );

  // ✅ Get previous and next items
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  // const currentItem = currentIndex >= 0 ? items[currentIndex] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < items.length - 1
      ? items[currentIndex + 1]
      : null;

  return (
    <section key={index} className={styles.features}>
        {/* ✅ Page Navigation Controls */}
        <div className={clsx("container text--left margin-bottom--lg",styles.pageNavigation)}>
          {prevItem ? (
            <Link  to={`/${prevItem.link}`}  className={clsx(styles.prev_navigation)} >
               <span> <HiMiniChevronLeft size={25} />{prevItem.title}</span>
            </Link>
          ):
          <Link to={`/`}  className={clsx("margin-right--sm justify-content--flex-center align-items--center",styles.paginationLink)}>
            <HiHome  size={20}/> All Categories
          </Link>
          }
          {nextItem && (
            <Link  to={`/${nextItem.link}`}  className={clsx(styles.button_navigation)} >
               <span>{nextItem.title} <HiMiniChevronRight  size={25}/></span>
            </Link>
          )}
        </div>
        <div className={clsx("container", styles.container_section)}>
          {/* Left Section */}
          <div className={clsx(styles.left_section)}>
            <LeftSection
              image={data?.image}
              title={data?.title}
              description={data?.description}
              items={data?.items}
            />
          </div>
          {/* Right Section — Example content for current page */}
          <div className={clsx("row", styles.right_section)}>
              {data?.items.map((props, idx) => (
                <RightSection key={idx} idx={idx} {...props} items={props.items} />
            ))}
          </div>
        </div>
    </section>
  );
};


// components
const ToggleTextButton = ({ expanded, description, onClick, title }) => {
  // If the description is short, don't render the button
  if (!description || description.length <= 255) return null;

  const label = expanded
    ? `Show less ${title}`
    : `Show more ${title}`;

  return (
    <p
      onClick={onClick}
      className={clsx("text-sm text-emerald-600 cursor-pointer", styles.toggleButton)}
    >
      {label}
    </p>
  );
};

const FormattedText = ({ text,expanded }) => {
  // Split text by ** and mark bold sections
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part.length > 255 && !expanded
                    ? `${part.substring(0, 255)}...`
                    : part}</span>;
      })}
    </>
  );
};