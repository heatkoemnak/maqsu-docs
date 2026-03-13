
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from "date-fns";
import styles from '../css/styles.module.css'
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useGlobalData from "@docusaurus/useGlobalData";
import { motion } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";

import {
  HiMiniChevronLeft,
  HiMiniChevronRight,
} from "react-icons/hi2";
import { PiInfo } from "react-icons/pi";
import { LiaAngleRightSolid } from "react-icons/lia";
import { useLocation } from '@docusaurus/router';
import { BsList, BsGrid } from "react-icons/bs";

export default function Topics({ topics }) {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('row'); // 'row' | 'grid'
  const globalData = useGlobalData();
  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 7;
  const totalPages = Math.ceil((topics?.groupSections?.length ?? 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentIndex = topicData?.findIndex(
    (item) => item.link === location.pathname
  );

  const prevItem = currentIndex > 0 ? topicData[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < topicData.length - 1
      ? topicData[currentIndex + 1]
      : null;

  const visibleCards = topics?.groupSections?.slice(startIndex, startIndex + itemsPerPage) ?? [];

  if (!topics) {
    return (
      <div className={clsx(styles.pageRoot)}>
        <div className={clsx(styles.mainLayout)} style={{ padding: 24 }}>
          <div>
            <h2 style={{ margin: 0 }}>Category not found</h2>
            <p style={{ marginTop: 8 }}>
              Missing category data for this route. Check `pages/Categories/*.mdx` and rebuild.
            </p>
          </div>
        </div>
      </div>
    );
  }



  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true); // 🔥 Start loading
        const fetchedTopics = globalData?.["topics-data"]?.default?.topics ?? [];
        setTopicData(fetchedTopics);
      } catch (err) {
        console.error("Error fetching Tina data:", err);
      } finally {
        setLoading(false); // 🔥 End loading
      }
    }
    fetchData();
  }, [globalData]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className={clsx(styles.pageRoot)}>
      {/* Top bar */}
      <div className={clsx(styles.topBar)}>
        <div className={clsx(styles.breadcrumbLeft)}>
          <Link href="/" className={clsx(styles.breadcrumbLink)}>All Categories</Link>
          <LiaAngleRightSolid size={11} className={clsx(styles.breadcrumbArrow)} />
          <span className={clsx(styles.breadcrumbCurrent)}>{topics?.title}</span>
        </div>

        <div className={clsx(styles.topBarRight)}>
          <div className={clsx(styles.viewToggle)}>
            <button
              onClick={() => setViewMode('row')}
              className={clsx(styles.viewToggleBtn, viewMode === 'row' && styles.viewToggleBtnActive)}
              title="List view"
              aria-label="Switch to list view"
            >
              <BsList size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(styles.viewToggleBtn, viewMode === 'grid' && styles.viewToggleBtnActive)}
              title="Grid view"
              aria-label="Switch to grid view"
            >
              <BsGrid size={16} />
            </button>
          </div>

          {totalPages > 1 && (
            <div className={clsx(styles.paginationContainer)}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={clsx(styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled)}
              >
                <HiMiniChevronLeft size={16} />
              </button>
              <span className={clsx(styles.paginationText)}>
                {currentPage} <span className={clsx(styles.paginationDivider)}>/</span> {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={clsx(styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled)}
              >
                <HiMiniChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className={clsx(styles.mainLayout)}>
        {/* Left sidebar */}
        {visibleCards?.length > 0 &&
         <aside className={clsx(styles.sidebar)}>
          <div className={clsx(styles.sidebarInner)}>
            <div className={clsx(styles.sidebarHeader)}>
              <PiInfo size={28} />
              <h2 className={clsx(styles.sidebarTitle)}>{topics?.title}</h2>
            </div>
            <div className={clsx(styles.sidebarDivider)} />
            {topics?.description && (
              <span className={clsx(styles.sidebarDescription)}>{topics?.description}</span>
            )}
            <div className={clsx(styles.sidebarMeta)}>
              <span className={clsx(styles.sidebarMetaLabel)}>Articles</span>
              <span className={clsx(styles.sidebarMetaValue)}>{topics?.groupSections?.length}</span>
            </div>
          </div>
        </aside>
        }

            <main className={clsx(visibleCards?.length > 0 && styles.articleList, viewMode === 'grid' && styles.articleGrid)}>

          {
            visibleCards?.map((props, idx) =>
              viewMode === 'grid' ? (
                <ArticleCard key={startIndex + idx} idx={startIndex + idx} {...props} root_path={location.pathname} />
              ) : (
                <ArticleRow key={startIndex + idx} idx={startIndex + idx} {...props} root_path={location.pathname} />
              )
            )}
          </main>


      </div>

      {/* Prev / Next navigation */}
      {(prevItem || nextItem) && visibleCards?.length > 0 && (
        <div className={clsx(styles.pageNavigation)}>
          {prevItem ? (
            <Link to={prevItem.link} className={clsx(styles.navLink, styles.navLinkPrev)}>
              <span className={clsx(styles.navIcon)}>
                <HiMiniChevronLeft size={18} />
              </span>
              <div>
                <span className={clsx(styles.navLabel)}>Previous</span>
                <span className={clsx(styles.navTitle)}>{prevItem.title}</span>
              </div>
            </Link>
          ) : <div className={clsx(styles.navPlaceholder)} />}

          {nextItem && (
            <Link to={nextItem.link} className={clsx(styles.navLink, styles.navLinkNext)}>
              <span className={clsx(styles.navIcon)}>
                <HiMiniChevronRight size={18} />
              </span>
              <div>
                <span className={clsx(styles.navLabel)}>Next</span>
                <span className={clsx(styles.navTitle)}>{nextItem.title}</span>
              </div>
            </Link>
          )}
        </div>
      )}

    </div>
  );
}

/* ─── Time Ago ─────────────────────────────────────────── */
function TimeAgo({ date }) {
  const getTimeAgo = () => {
    if (!date) return "Just now";
    const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (diffInSeconds < 60) return "Just now";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const [timeAgo, setTimeAgo] = useState(getTimeAgo());

  useEffect(() => {
    const interval = setInterval(() => setTimeAgo(getTimeAgo()), 60000);
    return () => clearInterval(interval);
  }, [date]);

  return <span>{timeAgo}</span>;
}

/* ─── Article Row ───────────────────────────────────────── */
const ArticleRow = ({ idx, link, title, root_path, date }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: idx * 0.05, ease: "easeOut" }}
    className={clsx(styles.articleRow)}
  >
    <a href={`${root_path}/${link}`} className={clsx(styles.articleRowLink)}>
      <div className={clsx(styles.articleRowLeft)}>
        <span className={clsx(styles.articleIcon)}>
          {/* <VscFile size={23} /> */}
            <FileText size={23} />
        </span>
        <div className={clsx(styles.articleMeta)}>
          <span className={clsx(styles.articleTitle)}>{title}</span>
          <span className={clsx(styles.articleDate)}>
            Updated <TimeAgo date={date} />
          </span>
        </div>
      </div>
      <span className={clsx(styles.articleArrow)}>
        <HiMiniChevronRight size={20} />
      </span>
    </a>
  </motion.div>
);

/* ─── Article Card (Grid) ───────────────────────────────── */
const ArticleCard = ({ idx, link, title, root_path, date }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, delay: idx * 0.04, ease: "easeOut" }}
    className={clsx(styles.articleCard)}
  >
    <a href={`${root_path}/${link}`} className={clsx(styles.articleCardLink)}>
      <div className={clsx(styles.articleCardTop)}>
        <span className={clsx(styles.articleCardIconWrap)}>
          <span className={clsx(styles.articleCardIcon)}>
            <FileText size={20} />
          </span>
        </span>
        <span className={clsx(styles.articleCardArrowWrap)}>
          <span className={clsx(styles.articleCardArrow)}>
            <HiMiniChevronRight size={16} />
          </span>
        </span>
      </div>
      <div className={clsx(styles.articleCardBody)}>
        <span className={clsx(styles.articleTitle)}>{title}</span>
        <span className={clsx(styles.articleDate)}>
          Updated <TimeAgo date={date} />
        </span>
      </div>
    </a>
  </motion.div>
);
