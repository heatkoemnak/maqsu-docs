import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from '@docusaurus/router';
import useGlobalData from '@docusaurus/useGlobalData';
import { BiCollapseAlt, BiExpandAlt } from 'react-icons/bi';
import { LiaAngleRightSolid } from 'react-icons/lia';
import { IoClose } from 'react-icons/io5';
import Link from '@docusaurus/Link';
import MdxString from './MdxString';
import { CardGrid } from './Cards/CardGrid';
import CustomTabsPage from './CustomTabsPage';
import { VideoPlayer } from './VideoPlayer/VideoPlayer';
import { Lists } from './Cards/Lists';
import { ProcessFlow } from './ProcessFlow/ProcessFlow';
import { Noted } from './Noted/Noted';
import { Steps } from './Steps/Steps';
import { HiMiniChevronLeft, HiMiniChevronRight, HiMiniChevronUp } from 'react-icons/hi2';
import Navbar from './Navbar/Navbar';
import Footer from './Footer';
import { formatDistanceToNow } from 'date-fns';
import CardList from './CardList/CardList';

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* -----------------------------------
     🔥 GET PAGE + END PATH SEGMENT
  ----------------------------------- */
  const { pageSlug, endPath } = useMemo(() => {
    const cleaned = location.pathname.replace(/\/$/, '');
    const segments = cleaned.split('/').filter(Boolean);
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

    const bySlug = globalData?.['categories-data']?.default?.bySlug ?? {};
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
          const id = sub.uid || sub.link?.replace('/', '');
          const sectionEl = document.getElementById(id);

          if (!sectionEl) return;

          const h3Elements = sectionEl.querySelectorAll('h3');
          if (h3Elements.length === 0) return;

          const usedHeadingIds = {};
          const formatStepTitle = (title) => {
            const t0 = (title || '').trim();
            // Normalize common "dash" characters to ASCII hyphen for consistent formatting.
            const t = t0.replace(/\u2013|\u2014|\u2212/g, '-');
            const m = t.match(/^step\s*([0-9]+)\s*[-:]+\s*(.+)$/i);
            if (m) return `Step ${m[1]} - ${m[2].trim()}`;

            const m2 = t.match(/^step\s*([0-9]+)\s+(.+)$/i);
            if (m2) return `Step ${m2[1]} - ${m2[2].trim()}`;

            const m3 = t.match(/^step\s*([0-9]+)$/i);
            if (m3) return `Step ${m3[1]}`;

            return t0;
          };

          extractedHeadings[id] = Array.from(h3Elements).map((h3) => {
            const rawTitle = (h3.textContent || '').trim();
            const textSlug = rawTitle
              .toLowerCase()
              .replace(/[^a-z0-9\\s-]/g, '')
              .replace(/\\s+/g, '-')
              .replace(/-+/g, '-');

            // Scope heading IDs to the subsection so repeated "Step 1 — Navigate"
            // in different subsections doesn't collide.
            const scopePrefix = `${group.uid}-${id}`;
            const baseId = `${scopePrefix}-${textSlug || 'section'}`;
            const nextCount = (usedHeadingIds[baseId] || 0) + 1;
            usedHeadingIds[baseId] = nextCount;
            const uniqueId = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

            h3.id = uniqueId;

            return {
              id: uniqueId,
              title: formatStepTitle(rawTitle || h3.textContent),
              level: 3,
            };
          });
        });
      });

      setHeadings(extractedHeadings);
    }, 300);

    // Initialize active state from hash (no JS scrolling)
    hashTimeoutId = setTimeout(() => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActive(hash);
      }
    }, 400);

    return () => {
      clearTimeout(headingsTimeoutId);
      clearTimeout(hashTimeoutId);
    };
  }, [posts]);

  /* -----------------------------------
     🔥 HASH HANDLING (no scroll spy)
  ----------------------------------- */
  useEffect(() => {
    if (!posts.length) return;

    // Hash change handler
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActive(hash || null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [posts]);

  useEffect(() => {
    const handleWindowScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };

    handleWindowScroll();
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

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
  const toggleSection = useCallback((id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const buildUrl = useCallback((uid) => `/${pageSlug}/${uid}`, [pageSlug]);
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* -----------------------------------
     🔥 NEXT & PREV
  ----------------------------------- */
  const { prevItem, nextItem } = useMemo(() => {
    if (!endPath || !allGroups.length) return { prevItem: null, nextItem: null };

    const currentIndex = allGroups.findIndex((group) => group.uid === endPath);

    return {
      prevItem: currentIndex > 0 ? allGroups[currentIndex - 1] : null,
      nextItem:
        currentIndex !== -1 && currentIndex < allGroups.length - 1
          ? allGroups[currentIndex + 1]
          : null,
    };
  }, [allGroups, endPath]);

  /* -----------------------------------
     🔥 TINA COMPONENTS
  ----------------------------------- */
  const tinaComponents = useMemo(
    () => ({
      CardGrid: (props) => <CardGrid {...props} />,
      tabsesctions: (props) => <CustomTabsPage {...props} />,
      VideoPlayer: (props) => <VideoPlayer {...props} />,
      Lists: (props) => <Lists {...props} />,
      ProcessFlow: (props) => <ProcessFlow {...props} />,
      Noted: (props) => <Noted {...props} />,
      Steps: (props) => <Steps {...props} />,
    }),
    [],
  );

  /* -----------------------------------
     🔥 TIME AGO COMPONENT
  ----------------------------------- */
  const TimeAgo = useMemo(() => {
    return function TimeAgoComponent({ date }) {
      const getTimeAgo = () => {
        if (!date) return 'Just now';
        const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (diffInSeconds < 60) return 'Just now';
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
        <div className="pq-content-breadcrumb">
          {posts?.map((post, i) => (
            <div key={i} className="pq-breadcrumb-row">
              {post?.breadcrumbs?.map((word, j) => (
                <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {j > 0 && (
                    <span className="sep" style={{ margin: '0 2px' }}>
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
          <div
            className="pq-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {sidebarOpen && (
          <nav className="pq-sidebar">
            <div className="pq-sidebar-mobile-bar">
              <span className="pq-sidebar-mobile-title">Menu</span>
              <button
                className="pq-sidebar-close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <IoClose size={18} />
              </button>
            </div>

            {posts.map((group) => (
              <div key={group.uid}>
                <div className="pq-group-header">
                  <span className="pq-group-title">{group.title}</span>
                </div>

                {group.sections?.length > 0 && (
                  <div className="pq-sub-menu">
                    {group.sections.map((sub) => {
                      const id = sub.uid || sub.link?.replace('/', '');
                      const hasSubHeadings = headings[id]?.length > 0;
                      const isExpanded = expandedSections[id];

                      return (
                        <div key={id}>
                          <a
                            href={`#${id}`}
                            onClick={() => {
                              setActive(id);
                              if (hasSubHeadings) toggleSection(id);
                            }}
                            className={`pq-sub-btn${active === id ? ' is-active' : ''}`}
                          >
                            <div className="sub-title">
                              <span>{sub.title}</span>
                            </div>
                          </a>

                          {hasSubHeadings && !isExpanded && (
                            <div className="pq-nested-menu">
                              {headings[id].map((heading) => (
                                <a
                                  key={heading.id}
                                  href={`#${heading.id}`}
                                  onClick={() => setActive(heading.id)}
                                  className={`pq-nested-btn${
                                    active === heading.id ? ' is-active' : ''
                                  }`}
                                  style={{ paddingLeft: heading.level === 4 ? '24px' : '12px' }}
                                >
                                  {heading.title}
                                </a>
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
        <div className={`pq-content${!sidebarOpen ? ' no-sidebar' : ''}`}>
          {showScrollTop && (
            <button onClick={scrollToTop} className="pq-scroll-top-btn" aria-label="Scroll to top">
              <HiMiniChevronUp size={18} />
            </button>
          )}

          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="pq-toggle-btn"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <BiExpandAlt size={15} /> : <BiCollapseAlt size={15} />}
          </button>

          <div className={`pq-docs-body${!sidebarOpen ? ' full-width' : ''}`}>
            <div className={`pq-inline-breadcrumb${!sidebarOpen ? ' full-width' : ''}`}>
              {posts?.map((post, i) => (
                <div key={i} className="pq-breadcrumb-row">
                  {post?.breadcrumbs?.map((word, j) => (
                    <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {j > 0 && (
                        <span className="sep" style={{ margin: '0 2px' }}>
                          <LiaAngleRightSolid size={8} />
                        </span>
                      )}
                      <Link to={word?.link}>{word?.title}</Link>
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {posts.map((group) => (
              <div key={group.uid}>
                <section
                  id={group.uid}
                  className={`pq-section-shell pq-section${!sidebarOpen ? ' full-width' : ''}`}
                >
                  <div className="pq-section-head">
                    <h1 className="pq-section-title pq-section-title-main">{group.title}</h1>
                    <TimeAgo date={group.date} />
                  </div>
                  {group.body && (
                    <div className="pq-section-content">
                      <MdxString source={group.body} components={tinaComponents} />
                    </div>
                  )}
                </section>

                {group.sections?.map((sub, si) => {
                  const id = sub.uid || sub.link?.replace('/', '');
                  return (
                    <div key={id}>
                      {si > 0 && <div className="page-divider" />}
                      <section
                        id={id}
                        className={`pq-section-shell pq-sub-section${
                          !sidebarOpen ? ' full-width' : ''
                        }`}
                      >
                        <div className="pq-section-head">
                          <h2 className="pq-section-title pq-section-title-sub">{sub.title}</h2>
                        </div>
                        {sub.body && (
                          <div className="pq-section-content">
                            <MdxString source={sub.body} components={tinaComponents} />
                          </div>
                        )}
                      </section>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAGINATION ── */}
      {endPath && (
        <div className={`pq-pagination${!sidebarOpen ? ' full-width' : ''}`}>
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
      --c-border: #d9dfec;
      --c-accent: #497194;
      --c-accent-2: #4338ca;
      --c-accent-bg: #eef0ff;
      --c-text: #111827;
      --c-muted: #5b6475;
      --c-faint: #9aa3b6;
      --c-sidebar: #ffffff;
      --sidebar-w: 250px;
      --content-max: 960px;
      --content-pad: clamp(16px, 3vw, 34px);
      --nav-h: 60px;
      --radius: 12px;
      --shadow-sm: 0 1px 2px rgba(17, 24, 39, 0.06), 0 1px 3px rgba(17, 24, 39, 0.08);
      --shadow-md: 0 16px 30px rgba(17, 24, 39, 0.12);
      --transition: 180ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .page-divider {
      width: 75%;
      margin: 0 auto 25px;
      background-color: var(--c-border);
    }

    .time-ago {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #848585;
      margin-top: 2px;
      margin-bottom: 20px;
    }

    .pq-page {
      min-height: 100vh;
      background-color: var(--c-bg);
      overflow-x: hidden;
    }

    .pq-content-breadcrumb {
      display: none;
    }

    .pq-inline-breadcrumb {
      width: 75%;
      margin: 0  auto;
      padding: 18px 0 10px;
      display: flex;
      align-items: center;
      position: relative;
    }

    .pq-inline-breadcrumb.full-width {
      width: 80%;
    }

    .pq-breadcrumb-row {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 12px;
      font-weight: 500;
      color: var(--c-muted);
      flex-wrap: wrap;
    }

    .pq-breadcrumb-row a {
      color: var(--c-muted);
      text-decoration: none;
      padding: 2px 4px;
      border-radius: 6px;
      transition: color var(--transition), background var(--transition);
    }

    .pq-breadcrumb-row a:hover {
      color: var(--c-accent);
      background: var(--c-accent-bg);
    }

    .pq-breadcrumb-row .sep {
      color: var(--c-faint);
      display: flex;
      align-items: center;
    }

    .pq-layout {
      display: flex;
      background: var(--c-bg);
      min-height: 100vh;
    }

    .pq-sidebar {
      width: var(--sidebar-w);
      flex-shrink: 0;
      padding: 20px 0 26px;
      height: calc(100vh - var(--nav-h));
      position: fixed;
      left: 0;
      top: var(--nav-h);
      overflow-y: auto;
      background: var(--c-sidebar);
      border-right: 1px solid var(--c-border);
      display: flex;
      flex-direction: column;
      gap: 2px;
      scrollbar-width: thin;
      scrollbar-color: var(--c-border) transparent;
      z-index: 30;
    }

    .pq-sidebar-backdrop {
      display: none;
    }

    .pq-sidebar-mobile-bar {
      display: none;
    }

    .pq-sidebar::-webkit-scrollbar {
      width: 4px;
    }

    .pq-sidebar::-webkit-scrollbar-thumb {
      background: var(--c-border);
      border-radius: 4px;
    }

    .pq-group-header {
      padding: 8px 18px 4px;
    }

    .pq-group-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--c-faint);
    }

    .pq-sub-menu {
      display: flex;
      flex-direction: column;
      padding: 2px 10px 0;
    }

    .pq-sub-btn {
      background: none;
      border: none;
      text-align: left;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: var(--c-muted);
      text-decoration: none;
      transition: background var(--transition), color var(--transition);
      line-height: 1.42;
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
    }

    .pq-sub-btn:hover {
      background: #f1f5f9;
      color: #1e293b;
      text-decoration: none;
    }

    .pq-sub-btn.is-active {
      color: var(--c-accent);
      font-weight: 600;
      background: #eef2ff;
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
      padding-left: 10px;
      border-left: 1px solid var(--c-border);
    }

    .pq-nested-btn {
      background: none;
      border: none;
      text-align: left;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      color: var(--c-muted);
      text-decoration: none;
      transition: background var(--transition), color var(--transition);
      line-height: 1.4;
      position: relative;
      display: block;
      width: 100%;
    }

    .pq-nested-btn:hover {
      background: #f1f5f9;
      color: #1e293b;
      text-decoration: none;
    }

    .pq-nested-btn.is-active {
      color: var(--c-accent);
      font-weight: 600;
    }

    .pq-content {
      flex: 1;
      min-width: 0;
      margin-left: var(--sidebar-w);
      position: relative;
      padding-bottom: 32px;
    }

    .pq-content.no-sidebar {
      margin-left: 0;
    }

    .pq-docs-body {
      width: 90%;
      margin: 0 auto;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .pq-docs-body.full-width {
      width:70%;
      margin: 0 auto;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .pq-toggle-btn {
      position: fixed;
      left: 14px;
      bottom: 82px;
      z-index: 60;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      width: 36px;
      height: 36px;
      border-radius: 10px;
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

    .pq-scroll-top-btn {
      position: fixed;
      left: 14px;
      bottom: 126px;
      z-index: 60;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid var(--c-border);
      background: var(--c-surface);
      color: var(--c-muted);
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: background var(--transition), color var(--transition), box-shadow var(--transition), opacity var(--transition);
    }

    .pq-scroll-top-btn:hover {
      color: var(--c-accent);
      box-shadow: var(--shadow-md);
    }

    .pq-section,
    .pq-sub-section {
      margin: 0  auto;
      width: 75%;
      scroll-margin-top: 84px;
      padding-top: 6px;
    }

    .pq-section.full-width,
    .pq-sub-section.full-width {
      width: 80%;
    }

    .pq-section-shell {
      background: transparent;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      padding: 8px 0;
    }

    .pq-section-head {
      display: flex;
      flex-direction: column;
    }

    .pq-section-title {
      margin: 0;
      color: var(--c-text) !important;
      letter-spacing: -0.02em;
      border-top: 1px solid var(--c-border);
    }

    .pq-section-title-main {
      font-size: clamp(1rem, 2.4vw, 2.8rem) !important;
      font-weight: 700 !important;
      line-height: 1.85 !important;
      letter-spacing: -0.03em !important;
    }

    .pq-section-title-sub {
      font-size: clamp(1.5rem, 2.5vw, 1.9rem) !important;
      font-weight: 600 !important;
      line-height: 1.85 !important;
      padding-top: 18px !important;
    }

    .pq-section-content h2 {
      font-size: clamp(1.35rem, 2.2vw, 1.65rem) !important;
      font-weight: 700 !important;
      color: var(--c-text) !important;
      line-height: 1.3 !important;
      margin: 20px 0 12px !important;
    }

    .pq-section-content h3 {
      font-size: 1.35rem !important;
      font-weight: 650 !important;
      color: #444444 !important;
      line-height: 1.4 !important;
      margin-top: 22px !important;
      padding-top: 8px !important;
      margin-bottom: 10px !important;
    }

    .pq-section-content h4 {
      font-size: 1.05rem !important;
      font-weight: 700 !important;
      color: #444444 !important;
      line-height: 1.4 !important;
      margin-top: 18px !important;
      margin-bottom: 10px !important;
      }

      .pq-section-content h5 {
        font-size: 0.95rem !important;
        font-weight: 600 !important;
        color: #444444 !important;
      line-height: 1.4 !important;
      margin-top: 16px !important;
      margin-bottom: 10px !important;
    }

    .pq-section-content p {
      color: #334155;
      margin-bottom: 12px;
    }

    .pq-section-content ol,
    .pq-section-content ul {
      margin: 0.75rem 0 1rem;
      padding-left: 1.5rem;
    }

    .pq-section-content li {
      margin: 0.34rem 0;
      line-height: 1.68;
    }

    .pq-section-content li > p {
      margin: 0;
    }

    .pq-section-content li > p + p {
      margin-top: 0.4rem;
    }

    .pq-section-content li > :last-child {
      margin-bottom: 0;
    }

    .pq-section-content code {
      font-size: 12.5px;
      background: #f2f4f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1px 6px;
      color: #9d174d;
      font-family: 'Fira Code', 'Cascadia Code', monospace;
    }

    .pq-section-content a {
      text-decoration: none;
      border-bottom: 1px solid var(--c-border);
      transition: border-color var(--transition), color var(--transition);
    }

    .pq-section-content a:hover {
      border-color: var(--c-accent);
      color: var(--c-accent-2);
    }

    .pq-section-content a[href^="/"]:not([href^="#"])::after {
      content: "\\2197";
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
      width: 60%;
      margin: 30px 420px;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      gap: 16px;
    }

    .pq-pagination.full-width {
      width: 60%;
      margin: 30px auto;
    }

    .pq-nav-link {
      display: flex;
      z-index: 1;
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
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
      border-color: #bfdbfe;
    }

    .pq-nav-link.next {
      justify-content: flex-end;
      text-align: right;
    }

    .pq-nav-link.prev {
      justify-content: flex-start;
    }

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
      color: #1e293b;
      line-height: 1.35;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-spacer {
      flex: 1;
    }

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
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
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
      background: #ffffff;
      transform: scale(1.1);
    }

    .sub-title {
      font-size: 0.9em;
      font-weight: 500;
      color: #3f3f46;
    }

    @media (max-width: 1200px) {
      :root {
        --sidebar-w: 238px;
        --content-max: 920px;
      }
    }

    @media (max-width: 996px) {
      .pq-sidebar-backdrop {
        position: fixed;
        left: 0;
        right: 0;
        top: var(--nav-h);
        bottom: 0;
        background: rgba(15, 23, 42, 0.35);
        z-index: 49;
      }

      .pq-sidebar-mobile-bar {
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px 10px;
        background: var(--c-sidebar);
        border-bottom: 1px solid var(--c-border);
        z-index: 1;
      }

      .pq-sidebar-mobile-title {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--c-faint);
      }

      .pq-sidebar-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        border: 1px solid var(--c-border);
        background: var(--c-surface);
        color: var(--c-muted);
        cursor: pointer;
      }

      .pq-sidebar-close:hover {
        color: var(--c-accent);
        box-shadow: var(--shadow-sm);
      }

      .pq-content {
        margin-left: 0;
      }

      .pq-sidebar {
        position: fixed;
        top: var(--nav-h);
        left: 0;
        height: calc(100vh - var(--nav-h));
        max-height: none;
        width: min(82vw, 300px);
        z-index: 50;
        box-shadow: var(--shadow-md);
        padding-top: 0;
      }

      .pq-inline-breadcrumb {
        padding-top: 14px;
        width: 92%;
        margin: 0 auto;
      }

      .pq-section {
        padding-top: 4px;
        width: 92%;
      }

      .pq-sub-section {
        padding-top: 4px;
        width: 92%;
      }

      .pq-docs-body,
      .pq-docs-body.full-width {
        width: 100%;
      }

      .pq-section-shell {
        padding: 6px 0;
      }

      .pq-pagination {
        padding: 0 16px 40px;
      }

      .pq-nav-link {
        padding: 12px 14px;
      }

      .pq-toggle-btn {
        left: 12px;
        bottom: 72px;
      }

      .pq-scroll-top-btn {
        left: 12px;
        bottom: 116px;
      }
    }

    @media (max-width: 768px) {
      .pq-sidebar {
        width: min(86vw, 320px);
      }

      .pq-inline-breadcrumb {
        width: 92%;
      }

      .pq-docs-body,
      .pq-docs-body.full-width {
        width: 100%;
      }

      .pq-section,
      .pq-sub-section,
      .pq-section.full-width,
      .pq-sub-section.full-width {
        width: 92%;
      }

      .pq-docs-body {
        padding: 8px 12px 12px;
      }

      .pq-section-head {
        display: block;
      }

      .time-ago {
        margin-top: 6px;
      }

      .pq-pagination {
        flex-direction: column;
        gap: 10px;
      }

      .pq-spacer {
        display: none;
      }

      .pq-nav-link.next,
      .pq-nav-link.prev {
        justify-content: space-between;
        text-align: left;
      }

      .pq-modal-content {
        max-width: 100vw;
        padding: 0 10px;
      }

      .pq-modal-close {
        position: fixed;
        top: 10px;
        right: 10px;
      }
    }
  `}</style>
);
