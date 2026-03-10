import React from "react";
import clsx from "clsx";
import { Link } from "@docusaurus/router";
import { HiMiniChevronLeft, HiMiniChevronRight, HiHome } from "react-icons/hi2";
import styles from "./styles.module.css";

const PageNavigation = ({ prevItem, nextItem }) => {
  return (
    <section
      key={prevItem?.link}
      className={clsx(
        styles.features,
        "py-8 border-t border-gray-200 bg-gray-50"
      )}
    >
      <div
        className={clsx(
          styles.pageNavigation,
          "flex justify-between items-center max-w-5xl mx-auto px-6"
        )}
      >
        {prevItem ? (
          <Link
            to={`/${prevItem.link}`}
            className={clsx(
              styles.prev_navigation,
              "flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            )}
          >
            <span className="flex items-center gap-1">
              <HiMiniChevronLeft size={22} />
              {prevItem.title}
            </span>
            <span className="text-sm text-gray-500">PREV</span>
          </Link>
        ) : (
          <Link
            to={`/`}
            className={clsx(
              "flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium"
            )}
          >
            <HiHome size={20} />
            All Categories
          </Link>
        )}

        {nextItem && (
          <Link
            to={`/${nextItem.link}`}
            className={clsx(
              styles.button_navigation,
              "flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            )}
          >
            <span className="flex items-center gap-1">
              {nextItem.title}
              <HiMiniChevronRight size={22} />
            </span>
            <span className="text-sm text-gray-500">NEXT</span>
          </Link>
        )}
      </div>
    </section>
  );
};

export default PageNavigation;
