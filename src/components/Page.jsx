import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "@docusaurus/router";
import useGlobalData from "@docusaurus/useGlobalData";
import { BiCollapseAlt, BiExpandAlt } from "react-icons/bi";
import { LiaAngleRightSolid } from "react-icons/lia";
import { IoClose } from "react-icons/io5";
import Link from "@docusaurus/Link";
import MdxString from "./MdxString";
import { CardGrid } from "./Cards/CardGrid";
import CustomTabsPage from "./CustomTabsPage";
import { VideoPlayer } from "./VideoPlayer/VideoPlayer";
import { Lists } from "./Cards/Lists";
import { ProcessFlow } from "./ProcessFlow/ProcessFlow";
import { Noted } from "./Noted/Noted";
import { Steps } from "./Steps/Steps";
import { HiMiniChevronLeft, HiMiniChevronRight } from "react-icons/hi2";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";
import { formatDistanceToNow } from "date-fns";

export default function Page() {
  const location = useLocation();
  const globalData = useGlobalData();

  const [posts, setPosts] = useState([]);
  const [active, setActive] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [allGroups, setAllGroups] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headings, setHeadings] = useState({});
  const [modalImage, setModalImage] = useState(null);

  /* -----------------------------------
     🔥 GET PAGE + END PATH SEGMENT
  ----------------------------------- */
  const { pageSlug, endPath } = useMemo(() => {
    const cleaned = location.pathname.replace(/\/$/, "");
    const segments = cleaned.split("/").filter(Boolean);
    return {
      pageSlug: segments[0],
      endPath: segments[1] || null,
    };
  }, [location.pathname]);

  /* -----------------------------------
     🔥 FETCH TINA DATA
  ----------------------------------- */
  useEffect(() => {
    if (!pageSlug) return;

    const bySlug = globalData?.["categories-data"]?.default?.bySlug ?? {};
    const category = bySlug[pageSlug] ?? null;
    const sections = category?.groupSections || [];

    setAllGroups(sections);

    if (endPath) {
      const matchedGroup = sections.find((group) => group.uid === endPath);
      setPosts(matchedGroup ? [matchedGroup] : sections);
    } else {
      setPosts(sections);
    }

    setActive(null);
  }, [pageSlug, endPath, globalData]);

  /* -----------------------------------
     🔥 COMBINED INITIAL SETUP
  ----------------------------------- */
  useEffect(() => {
    if (!posts.length) return;

    let headingsTimeoutId;
    let hashTimeoutId;

    // Extract headings
    headingsTimeoutId = setTimeout(() => {
      const extractedHeadings = {};

      posts.forEach((group) => {
        group.sections?.forEach((sub) => {
          const id = sub.uid || sub.link?.replace("/", "");
          const sectionEl = document.getElementById(id);

          if (!sectionEl) return;

          const h3Elements = sectionEl.querySelectorAll('h3');
          if (h3Elements.length === 0) return;

          extractedHeadings[id] = Array.from(h3Elements).map((h3) => {
            const sectionWrapperId = group.uid;
            const textSlug = h3.textContent.toLowerCase().replace(/\s+/g, '-');
            const scopedId = `${sectionWrapperId}-${textSlug}`;

            if (!h3.id) h3.id = scopedId;

            return {
              id: scopedId,
              title: h3.textContent,
              level: 3,
            };
          });
        });
      });

      setHeadings(extractedHeadings);
    }, 300);

    // Handle initial hash scroll
    hashTimeoutId = setTimeout(() => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActive(hash);
        }
      }
    }, 400);

    return () => {
      clearTimeout(headingsTimeoutId);
      clearTimeout(hashTimeoutId);
    };
  }, [posts]);

  /* -----------------------------------
     🔥 COMBINED SCROLL SPY & HASH HANDLING
  ----------------------------------- */
  useEffect(() => {
    if (!posts.length) return;

    // Build IDs list
    const allIds = [];
    posts.forEach((group) => {
      allIds.push(group.uid);
      group.sections?.forEach((sub) => {
        const id = sub.uid || sub.link?.replace("/", "");
        if (id) {
          allIds.push(id);
          headings[id]?.forEach((heading) => allIds.push(heading.id));
        }
      });
    });

    let scrollTimeoutId;

    // Scroll spy handler
    const handleScroll = () => {
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);

      scrollTimeoutId = setTimeout(() => {
        let currentId = null;
        const threshold = window.innerHeight * 0.3;

        for (const id of allIds) {
          const el = document.getElementById(id);
          if (!el) continue;

          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            currentId = id;
          }
        }

        if (currentId && currentId !== active) {
          setActive(currentId);
          window.history.replaceState(null, "", `#${currentId}`);
        }
      }, 100);
    };

    // Hash change handler
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActive(hash);
        }
      }
    };

    // Add listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
    };
  }, [posts, headings]);

  /* -----------------------------------
     🔥 COMBINED MODAL HANDLERS
  ----------------------------------- */
  useEffect(() => {
    // Image click handler
    const handleImageClick = (e) => {
      if (e.target.tagName === 'IMG') {
        setModalImage(e.target.src);
      }
    };

    // ESC key handler
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalImage) {
        setModalImage(null);
      }
    };

    const contentArea = document.querySelector('.pq-content');

    if (contentArea) {
      contentArea.addEventListener('click', handleImageClick);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (contentArea) {
        contentArea.removeEventListener('click', handleImageClick);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalImage]);

  /* -----------------------------------
     🔥 MEMOIZED FUNCTIONS
  ----------------------------------- */
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActive(id);
  }, []);

  const toggleSection = useCallback((id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const buildUrl = useCallback((uid) => `/${pageSlug}/${uid}`, [pageSlug]);

  /* -----------------------------------
     🔥 NEXT & PREV
  ----------------------------------- */
  const { prevItem, nextItem } = useMemo(() => {
    if (!endPath || !allGroups.length) return { prevItem: null, nextItem: null };

    const currentIndex = allGroups.findIndex((group) => group.uid === endPath);

    return {
      prevItem: currentIndex > 0 ? allGroups[currentIndex - 1] : null,
      nextItem: currentIndex !== -1 && currentIndex < allGroups.length - 1
        ? allGroups[currentIndex + 1]
        : null,
    };
  }, [allGroups, endPath]);

  /* -----------------------------------
     🔥 TINA COMPONENTS
  ----------------------------------- */
  const tinaComponents = useMemo(() => ({
    CardGrid: (props) => <CardGrid {...props} />,
    tabsesctions: (props) => <CustomTabsPage {...props} />,
    VideoPlayer: (props) => <VideoPlayer {...props} />,
    Lists: (props) => <Lists {...props} />,
    ProcessFlow: (props) => <ProcessFlow {...props} />,
    Noted: (props) => <Noted {...props} />,
    Steps: (props) => <Steps {...props} />,

  }), []);

  /* -----------------------------------
     🔥 TIME AGO COMPONENT
  ----------------------------------- */
  const TimeAgo = useMemo(() => {
    return function TimeAgoComponent({ date }) {
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

      return <span className="time-ago"> Updated {timeAgo}</span>;
    };
  }, []);

  return (
    <div className="pq-page">
      <GlobalStyles />
      <Navbar />

      {/* ── IMAGE MODAL ── */}
      {modalImage && (
        <div className="pq-image-modal" onClick={() => setModalImage(null)}>
          <div className="pq-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="pq-modal-close"
              onClick={() => setModalImage(null)}
              aria-label="Close modal"
            >
              <IoClose size={24} />
            </button>
            <img src={modalImage} alt="Enlarged view" className="pq-modal-image" />
          </div>
        </div>
      )}

      {/* ── BREADCRUMB ── */}
      {sidebarOpen && (
        <div className="pq-breadcrumb-bar">
          {posts?.map((post, i) => (
            <div key={i} className="pq-breadcrumb-row">
              {post?.breadcrumbs?.map((word, j) => (
                <span key={j} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {j > 0 && (
                    <span className="sep" style={{ margin: "0 2px" }}>
                      <LiaAngleRightSolid size={8} />
                    </span>
                  )}
                  <Link to={word?.link}>{word?.title}</Link>
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── LAYOUT ── */}
      <div className="pq-layout">
        {/* Sidebar */}
        {sidebarOpen && (
          <nav className="pq-sidebar">
            {posts.map((group) => (
              <div key={group.uid}>
                <div className="pq-group-header">
                  <span className="pq-group-title">{group.title}</span>
                </div>

                {group.sections?.length > 0 && (
                  <div className="pq-sub-menu">
                    {group.sections.map((sub) => {
                      const id = sub.uid || sub.link?.replace("/", "");
                      const hasSubHeadings = headings[id]?.length > 0;
                      const isExpanded = expandedSections[id];

                      return (
                        <div key={id}>
                          <button
                            onClick={() => {
                              scrollTo(id);
                              if (hasSubHeadings) toggleSection(id);
                            }}
                            className={`pq-sub-btn${active === id ? " is-active" : ""}`}
                          >
                            <div className="sub-title">
                              <span>{sub.title}</span>
                            </div>
                          </button>

                          {hasSubHeadings && isExpanded && (
                            <div className="pq-nested-menu">
                              {headings[id].map((heading) => (
                                <button
                                  key={heading.id}
                                  onClick={() => scrollTo(heading.id)}
                                  className={`pq-nested-btn${active === heading.id ? " is-active" : ""}`}
                                  style={{ paddingLeft: heading.level === 4 ? '24px' : '12px' }}
                                >
                                  {heading.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Content */}
        <div className="pq-content">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="pq-toggle-btn"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <BiExpandAlt size={15} /> : <BiCollapseAlt size={15} />}
          </button>

          {posts.map((group) => (
            <div key={group.uid}>
              <section
                id={group.uid}
                className={`pq-section${!sidebarOpen ? " full-width" : ""}`}
              >
                <div className="header-title">
                  <h1>{group.title}</h1>
                  <TimeAgo date={group.date} />
                </div>
                {group.body && (
                  <MdxString source={group.body} components={tinaComponents} />
                )}
              </section>

              {group.sections?.map((sub, si) => {
                const id = sub.uid || sub.link?.replace("/", "");
                return (
                  <div key={id}>
                    {si > 0 && <div className="page-divider" />}
                    <section
                      id={id}
                      className={`pq-sub-section${!sidebarOpen ? " full-width" : ""}`}
                    >
                      <h2>{sub.title}</h2>
                      {sub.body && (
                        <MdxString source={sub.body} components={tinaComponents} />
                      )}
                    </section>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── PAGINATION ── */}
      {endPath && (
        <div className="pq-pagination">
          {prevItem ? (
            <Link to={buildUrl(prevItem.uid)} className="pq-nav-link prev">
              <HiMiniChevronLeft size={20} className="pq-nav-icon" />
              <div>
                <div className="pq-nav-label">Previous</div>
                <div className="pq-nav-title">{prevItem.title}</div>
              </div>
            </Link>
          ) : (
            <div className="pq-spacer" />
          )}

          {nextItem && (
            <Link to={buildUrl(nextItem.uid)} className="pq-nav-link next">
              <div>
                <div className="pq-nav-label">Next</div>
                <div className="pq-nav-title">{nextItem.title}</div>
              </div>
              <HiMiniChevronRight size={20} className="pq-nav-icon" />
            </Link>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    :root {
      --c-bg: #ffffff;
      --c-surface: #ffffff;
      --c-border: #eff3f6;
      --c-accent: #3188b7;
      --c-accent-2: #1d4ed8;
      --c-accent-bg: #e4edf2;
      --c-text: #6f96b3;
      --c-muted: #6b7280;
      --c-faint: #9ca3af;
      --c-sidebar: rgb(255, 255, 255);
      --sidebar-w: 318px;
      --radius: 10px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      --shadow-md: 0 4px 16px rgba(27, 98, 143, 0.07);
      --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .page-divider {
      width: 100%;
      height: 12px;
      background-color: #eef3f7;
      margin: 2rem 0;
    }

    .time-ago {
      font-size: 12px;
      font-weight: 500;
      color: var(--c-muted);
    }

    .pq-page {
      min-height: 100vh;
      background-color: var(--c-bg);
    }

    .pq-breadcrumb-bar {
      width: 100%;
      position: sticky;
      top: 0;
      padding: 0 48px;
      border-bottom: 1px solid var(--c-border);
      display: flex;
      align-items: center;
      min-height: 42px;
    }

    .pq-breadcrumb-row {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      font-weight: 500;
      color: var(--c-muted);
    }

    .pq-breadcrumb-row a {
      color: var(--c-muted);
      text-decoration: none;
      padding: 2px;
      border-radius: 5px;
      transition: color var(--transition), background var(--transition);
    }

    .pq-breadcrumb-row a:hover {
      color: var(--c-accent);
    }

    .pq-breadcrumb-row .sep {
      color: var(--c-faint);
      display: flex;
      align-items: center;
    }

    .pq-layout {
      display: flex;
      background: var(--c-bg);
      min-height: calc(100vh - 42px);
    }

    .pq-sidebar {
      width: var(--sidebar-w);
      flex-shrink: 0;
      padding: 32px 0;
      border-right: 1px solid var(--c-border);
      height: 100vh;
      position: sticky;
      top: 42px;
      overflow-y: auto;
      background: var(--c-sidebar);
      display: flex;
      flex-direction: column;
      gap: 4px;
      scrollbar-width: thin;
      scrollbar-color: var(--c-border) transparent;
    }

    .pq-sidebar::-webkit-scrollbar { width: 4px; }
    .pq-sidebar::-webkit-scrollbar-thumb {
      background: var(--c-border);
      border-radius: 4px;
    }

    .pq-group-header {
      padding: 6px 20px 0;
      margin-top: -10px;
    }

    .pq-group-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--c-faint);
    }

    .pq-sub-menu {
      display: flex;
      flex-direction: column;
      padding: 2px 10px;
    }

    .pq-sub-btn {
      background: none;
      border: none;
      text-align: left;
      padding: 7px 14px;
      border-radius: 7px;
      cursor: pointer;
      font-size: 13.5px;
      font-weight: 400;
      color: var(--c-muted);
      transition: background var(--transition), color var(--transition);
      line-height: 1.45;
      position: relative;
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .pq-sub-btn:hover {
      background: var(--c-border);
      color: var(--c-text);
    }

    .pq-sub-btn.is-active {
      color: var(--c-accent);
      font-weight: 600;
    }

    .pq-sub-btn.is-active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 20%;
      height: 60%;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: var(--c-accent);
    }

    .pq-nested-menu {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
      padding-left: 8px;
      border-left: 1px solid var(--c-border);
    }

    .pq-nested-btn {
      background: none;
      border: none;
      text-align: left;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12.5px;
      font-weight: 400;
      color: var(--c-muted);
      transition: background var(--transition), color var(--transition);
      line-height: 1.4;
      position: relative;
    }

    .pq-nested-btn:hover {
      background: var(--c-border);
      color: var(--c-text);
    }

    .pq-nested-btn.is-active {
      color: var(--c-accent);
      font-weight: 500;
    }

    .pq-content {
      flex: 1;
      min-width: 0;
      background: #ffffff;
      position: relative;
    }

    .pq-toggle-btn {
      position: sticky;
      top: 58px;
      z-index: 40;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 14px 0 0 16px;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid var(--c-border);
      background: var(--c-surface);
      color: var(--c-muted);
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: background var(--transition), color var(--transition), box-shadow var(--transition);
    }

    .pq-toggle-btn:hover {
      color: var(--c-accent);
      box-shadow: var(--shadow-md);
    }

    .pq-section {
      margin: 0 auto;
      width: 70%;
      scroll-margin-top: 100px;
    }

    .pq-section.full-width {
      max-width: 960px;
    }

    .pq-section h1 {
      font-size: 2.6rem !important;
      font-weight: 600 !important;
      color: var(--c-text) !important;
      line-height: 1.2 !important;
      letter-spacing: -0.02em !important;
    }

    .header-title {
      display: block;
      font-size: 2.8rem !important;
      font-weight: 600 !important;
      color: var(--c-text) !important;
      letter-spacing: 0.02em !important;
    }

    .pq-sub-section {
      margin: 0 auto;
      width: 70%;
      padding: 36px 0;
      scroll-margin-top: 70px;
    }

    .pq-sub-section.full-width {
      max-width: 960px;
    }

    .pq-sub-section h2 {
      font-size: 1.8rem !important;
      font-weight: 600 !important;
      color: rgb(89, 94, 94) !important;
      line-height: 1.3 !important;
      letter-spacing: -0.015em !important;
      margin-bottom: 16px !important;
    }

    .pq-sub-section h3 {
      font-size: 1.5rem !important;
      font-weight: 450 !important;
      color: rgb(89, 94, 94) !important;
      line-height: 1.4 !important;
      margin-top: 28px !important;
      padding-top: 25px !important;
      margin-bottom: 12px !important;
    }

    .pq-sub-section h4 {
      font-size: 1.1rem !important;
      font-weight: 450 !important;
      color: rgb(89, 94, 94) !important;
      line-height: 1.4 !important;
      margin-top: 20px !important;
      margin-bottom: 10px !important;
    }

    .pq-sub-section h5 {
      font-size: 0.99rem !important;
      font-weight: 450 !important;
      color: rgb(89, 94, 94) !important;
      line-height: 1.4 !important;
      margin-top: 20px !important;
      margin-bottom: 10px !important;
    }

    .pq-section p,
    .pq-sub-section p {
      font-size: 15px;
      line-height: 1.8;
      color: #374151;
      margin-bottom: 14px;
    }

    .pq-section code,
    .pq-sub-section code {
      font-size: 13px;
      background: #f3f4f6;
      border: 1px solid var(--c-border);
      border-radius: 5px;
      padding: 1px 6px;
      color: #c2185b;
      font-family: 'Fira Code', 'Cascadia Code', monospace;
    }

    .pq-section a,
    .pq-sub-section a {
      color: var(--c-accent);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color var(--transition);
    }

    .pq-section a:hover,
    .pq-sub-section a:hover {
      border-color: var(--c-accent);
    }

    .pq-section a[href^="/"]:not([href^="#"])::after,
    .pq-sub-section a[href^="/"]:not([href^="#"])::after {
      content: '↗';
      font-size: 0.75em;
      margin-left: 3px;
      opacity: 0.6;
    }

    .pq-divider {
      width: 100%;
      margin: 0 auto;
      padding: 0 2px;
      height: 1px;
      background: var(--c-border);
    }

    .pq-pagination {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      gap: 16px;
      padding: 52px 250px;
      background: var(--c-border);
      border-top: 1px solid var(--c-border);
    }

    .pq-nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none !important;
      border: 1px solid var(--c-border);
      border-radius: var(--radius);
      padding: 14px 20px;
      background: var(--c-surface);
      transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
      flex: 1;
      min-width: 0;
    }

    .pq-nav-link:hover {
      border-color: #93c5fd;
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }

    .pq-nav-link.next { justify-content: flex-end; text-align: right; }
    .pq-nav-link.prev { justify-content: flex-start; }

    .pq-nav-icon {
      flex-shrink: 0;
      color: var(--c-accent);
      opacity: 0.7;
    }

    .pq-nav-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: var(--c-faint);
      margin-bottom: 2px;
    }

    .pq-nav-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--c-text);
      line-height: 1.35;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-spacer { flex: 1; }

    .pq-image-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 40px;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .pq-modal-content {
      position: relative;
      max-width: 95vw;
      max-height: 95vh;
      animation: zoomIn 0.3s ease-out;
    }

    @keyframes zoomIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .pq-modal-image {
      max-width: 100%;
      max-height: 95vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .pq-modal-close {
      position: absolute;
      top: -40px;
      right: -40px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #374151;
      transition: background var(--transition), transform var(--transition);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .pq-modal-close:hover {
      background: white;
      transform: scale(1.1);
    }

    .sub-title {
      font-size: 0.9em;
      font-weight: 500;
      color: hsl(0, 1%, 35%);
    }
  `}</style>
);
