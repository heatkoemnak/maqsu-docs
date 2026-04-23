import Layout from '@theme/Layout';
import '../css/page.css';
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
import { TimeAgo } from './TimeAgo';
import CardList from './CardList/CardList';
import { BsArrowRightCircle, BsCaretLeftSquare } from "react-icons/bs";
import { BsCaretRightSquare } from "react-icons/bs";
import { FcPrevious,FcNext  } from "react-icons/fc";
import { TbChevronCompactRight,TbChevronCompactLeft } from "react-icons/tb";
import { motion, AnimatePresence } from 'framer-motion';

export default function Page() {
  const location = useLocation();
  const globalData = useGlobalData();

  const [posts, setPosts] = useState([]);
  const [active, setActive] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [allGroups, setAllGroups] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
     🔥 HASH HANDLING (Scrolling & Active state)
  ----------------------------------- */
  useEffect(() => {
    if (!posts.length) return;

    const hash = location.hash.replace('#', '');
    if (hash) {
      setActive(hash);
      window.isNavigating = true;
      // Scroll to the element if it exists
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Reset navigating flag after scroll completes
        setTimeout(() => {
          window.isNavigating = false;
        }, 1000);
      }, 100);
    } else {
      setActive(null);
    }
  }, [location.hash, posts]);

  useEffect(() => {
    if (!posts.length) return;

    const targetIds = [];

    posts.forEach((group) => {
      group.sections?.forEach((sub) => {
        const subId = sub.uid || sub.link?.replace('/', '');
        if (!subId) return;

        targetIds.push(subId);

        headings[subId]?.forEach((heading) => {
          if (heading?.id) targetIds.push(heading.id);
        });
      });
    });

    if (!targetIds.length) return;

    const uniqueIds = Array.from(new Set(targetIds));
    let ticking = false;

    const updateActiveOnScroll = () => {
      const anchorTop = 180;
      let lastPassed = null;
      let firstUpcoming = null;

      uniqueIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const top = el.getBoundingClientRect().top;
        if (top <= anchorTop) {
          if (!lastPassed || top > lastPassed.top) {
            lastPassed = { id, top };
          }
        } else if (!firstUpcoming || top < firstUpcoming.top) {
          firstUpcoming = { id, top };
        }
      });

      const nextActive = lastPassed?.id || firstUpcoming?.id || null;
      if (nextActive) {
        setActive((prev) => (prev === nextActive ? prev : nextActive));
      }
    };

    const onScroll = () => {
      if (ticking || window.isNavigating) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        updateActiveOnScroll();
        ticking = false;
      });
    };

    updateActiveOnScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [posts, headings]);

  // Scroll the sidebar to the active item
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        const activeEl = document.querySelector('.pq-sidebar .is-active');
        if (activeEl && typeof activeEl.scrollIntoView === 'function') {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [active]);

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
  const hasSubcategories = useMemo(
    () => posts.some((group) => (group.sections?.length || 0) > 0),
    [posts],
  );

  useEffect(() => {
    if (!hasSubcategories && sidebarOpen) {
      setSidebarOpen(true);
    }
  }, [hasSubcategories, sidebarOpen]);

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

  return (
    <Layout noFooter noNavbar>
      <div className="pq-page">
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
      {hasSubcategories && sidebarOpen && (
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
        {hasSubcategories && sidebarOpen && (
          <div
            className="pq-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {hasSubcategories && sidebarOpen && (
          <nav className="pq-sidebar">
            <div className="pq-sidebar-mobile-bar">
              <span className="pq-sidebar-mobile-title">Menu</span>
              {/* <button
                className="pq-sidebar-close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <IoClose size={18} />
              </button> */}
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
                      const isChildActive = headings[id]?.some(h => h.id === active);
                      const isParentActive = active === id || isChildActive;
                      // Auto-expand if active, or if manually toggled
                      const isExpanded = isParentActive || expandedSections[id];

                      return (
                        <div key={id}>
                          <a
                            href={`#${id}`}
                            onClick={() => {
                              setActive(id);
                              if (hasSubHeadings) toggleSection(id);
                            }}
                            className={`pq-sub-btn${isParentActive ? ' is-active' : ''}`}
                          >
                            <div className="sub-title">
                              <span>{sub.title}</span>
                            </div>
                          </a>

                          <AnimatePresence initial={false}>
                            {hasSubHeadings && isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                              >
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
                              </motion.div>
                            )}
                          </AnimatePresence>
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
            <button onClick={scrollToTop} className="pq-header-show-btn" aria-label="Show header">
              <HiMiniChevronUp size={14} />
              <span>Show Header</span>
            </button>
          )}

          {/* {hasSubcategories && (
            <div
              onClick={() => setSidebarOpen((prev) => !prev)}
              className={`pq-toggle-btn${sidebarOpen ? ' is-sidebar-open' : ''}`}
            >
              {sidebarOpen ? <TbChevronCompactLeft color='rgb(174, 192, 192)'  size={25}/> : <TbChevronCompactRight color='rgb(174, 192, 192)' size={25} />}
            </div>
          )} */}

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
                  {/* <div className="pq-section-head">
                    <h1 className="pq-section-title pq-section-title-main">{group.title}</h1>
                  </div> */}
                  {group.body && (
                    <div className="pq-section-content">
                      <MdxString source={group.body} components={tinaComponents} />
                    </div>
                  )}
                  <TimeAgo date={group.date} />
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
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
    </Layout>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
