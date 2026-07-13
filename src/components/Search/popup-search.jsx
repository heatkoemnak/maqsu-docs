import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search as SearchIcon, X, ChevronDown, FileText, Command, CornerDownLeft, Sparkles, AlertCircle } from "lucide-react";
import styles from "./styles.module.css";
import useGlobalData from "@docusaurus/useGlobalData";
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import clsx from "clsx";

const MAX_RESULTS = 10;
const cleanUrl = (url = "") => String(url).replace(/\/+/g, "/");

/* -------------------------
   Helpers
------------------------- */
const stripMarkdown = (text = "") =>
  String(text)
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildExcerpt = (content = "", max = 150) => {
  const clean = stripMarkdown(content);
  if (!clean) return "";
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}...` : clean;
};

const extractMarkdownBlocks = (markdown = "") => {
  const text = String(markdown || "").replace(/\r\n/g, "\n");
  const headingRegex = /^(#{3,4})\s+(.+?)$/gm;
  const matches = [...text.matchAll(headingRegex)];
  if (!matches.length) return [];
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? text.length : text.length;
    const level = match[1].length;
    const rawTitle = match[2].trim();
    const rawBlock = text.slice(start, end).trim();
    return { level, rawTitle, title: stripMarkdown(rawTitle), content: stripMarkdown(rawBlock) };
  });
};

const normalizeHeadingText = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "")
    .replace(/-+/g, "");

const buildScopedHeadingId = ({ groupUid = "", sectionId = "", headingText = "", usedIds = {} }) => {
  const textSlug = normalizeHeadingText(headingText) || "section";
  const baseId = sectionId ? `${groupUid}-${sectionId}-${textSlug}` : `${groupUid}-${textSlug}`;
  const nextCount = (usedIds[baseId] || 0) + 1;
  usedIds[baseId] = nextCount;
  return nextCount === 1 ? baseId : `${baseId}-${nextCount}`;
};

function PopupSearch({ isOpen, setIsOpen }) {
      const [showTopics, setShowTopics] = useState(false);
      const [query, setQuery] = useState("");
      const [results, setResults] = useState([]);
      const [activeIndex, setActiveIndex] = useState(0);
      const inputRef = useRef(null);
      const topicsRef = useRef(null);
      const history = useHistory();
    
      const globalData = useGlobalData();
      const topicsData = globalData?.["topics-data"]?.default?.topics ?? [];
      const categoriesBySlug = globalData?.["categories-data"]?.default?.bySlug ?? {};
    
      const categories = useMemo(() => {
        const list = Object.entries(categoriesBySlug).map(([slug, data]) => ({ slug, ...(data || {}) }));
        const order = new Map(topicsData.map((t, idx) => {
          const s = String(t?.link || "").replace(/^\//, "").split("/")[0];
          return s ? [s, idx] : null;
        }).filter(Boolean));
    
        list.sort((a, b) => {
          const oa = order.has(a.slug) ? order.get(a.slug) : 999;
          const ob = order.has(b.slug) ? order.get(b.slug) : 999;
          if (oa !== ob) return oa - ob;
          return String(a.title || a.slug).localeCompare(String(b.title || b.slug));
        });
        return list;
      }, [categoriesBySlug, topicsData]);
    
      const searchIndex = useMemo(() => {
        const items = [];
        categories.forEach((category) => {
          const baseSlug = category.slug || category.uid || "docs";
          (category.groupSections || []).forEach((group) => {
            const groupSlug = group.uid || String(group.link || "").split("#")[0];
            const groupLink = cleanUrl(`/${baseSlug}/${groupSlug}`);
            items.push({ title: group.title, link: groupLink, category: category.title, content: group.body || group.description || "" });
            const groupBlocks = extractMarkdownBlocks(group.body || group.description || "");
            const usedGroupIds = {};
            groupBlocks.forEach((block) => {
              const id = buildScopedHeadingId({ groupUid: group.uid || groupSlug, sectionId: "", headingText: block.rawTitle, usedIds: usedGroupIds });
              items.push({ title: block.title, link: `${groupLink}#${id}`, category: `${category.title} → ${group.title}`, content: block.content });
            });
            (group.sections || []).forEach((section) => {
              const sectionId = section.uid || section.link?.replace("/", "") || "";
              const sectionLink = `${groupLink}#${sectionId}`;
              items.push({ title: section.title, link: sectionLink, category: group.title, content: section.body || "" });
              const blocks = extractMarkdownBlocks(section.body || "");
              const usedHeadingIds = {};
              blocks.forEach((block) => {
                const uniqueId = buildScopedHeadingId({ groupUid: group.uid || groupSlug, sectionId: sectionId, headingText: block.rawTitle, usedIds: usedHeadingIds });
                items.push({ title: block.title, link: `${groupLink}#${uniqueId}`, category: `${group.title} → ${section.title}`, content: block.content });
              });
            });
          });
        });
        return items;
      }, [categories]);
    
      const fuse = useMemo(() => new Fuse(searchIndex, {
        keys: [
          { name: 'title', weight: 0.8 },
          { name: 'category', weight: 0.3 },
          { name: 'content', weight: 0.2 }
        ],
        threshold: 0.25,
        distance: 1000,
        ignoreLocation: true,
        useExtendedSearch: true,
        includeMatches: true,
        minMatchCharLength: 2,
      }), [searchIndex]);
    
      const handleNavigate = useCallback((link) => {
        setIsOpen(false);
        setShowTopics(false);
        setTimeout(() => {
          history.push(link);
        }, 100);
      }, [history]);
    
      useEffect(() => {
        const handleGlobalKeyDown = (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setIsOpen(true); }
          if (e.key === "Escape") { setIsOpen(false); setShowTopics(false); }
    
          if (isOpen && results.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === "Enter") {
              const selected = results[activeIndex];
              if (selected) {
                e.preventDefault();
                handleNavigate(selected.link);
              }
            }
          }
        };
        window.addEventListener("keydown", handleGlobalKeyDown);
        const handleClickOutside = (e) => { if (topicsRef.current && !topicsRef.current.contains(e.target)) setShowTopics(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          window.removeEventListener("keydown", handleGlobalKeyDown);
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [isOpen, results, activeIndex, handleNavigate]);
    
      useEffect(() => {
        if (isOpen) {
          setTimeout(() => inputRef.current?.focus(), 100);
          document.body.style.overflow = "hidden";
        }
        else { setQuery(""); setResults([]); document.body.style.overflow = "unset"; }
      }, [isOpen]);
    
      const handleSearch = (val) => {
        setQuery(val);
        if (!val.trim()) { setResults([]); return; }
        const fuseResults = fuse.search(val).slice(0, MAX_RESULTS);
        setResults(fuseResults.map(r => r.item));
        setActiveIndex(0);
      };

  return (
        <AnimatePresence>
        {isOpen && (
          <div className={styles.modalOverlay}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 35, stiffness: 400 }}
              className={styles.searchModal}
            >
              <div className={styles.modalHeader}>
                <SearchIcon size={19} className={styles.modalSearchIcon} />
                <input ref={inputRef}  className={styles.modalInput}  type="text" placeholder="What can we help you find?" value={query} onChange={(e) => handleSearch(e.target.value)}/>
                <button className={styles.closeButton} onClick={() => setIsOpen(false)}><X size={18} /></button>
              </div>
              <div className={styles.modalBody}>
                {results.length > 0 ? (
                  <div className={styles.resultsList}>
                    {results.map((item, idx) => (
                      <div key={idx} className={clsx(styles.resultItem, idx === activeIndex && styles.activeResult)} onClick={() => handleNavigate(item.link)} onMouseEnter={() => setActiveIndex(idx)}>
                        <div className={styles.resultIcon}><FileText size={18} /></div>
                        <div className={styles.resultContent}>
                          <div className={styles.resultTitleWrap}>
                            <span className={styles.resultCategory}>{item.category}</span>
                            <span className={styles.resultTitle}>{item.title}</span>
                          </div>
                          {item.content && (<p className={styles.resultExcerpt}>{buildExcerpt(item.content)}</p>)}
                        </div>
                        {idx === activeIndex && (<div className={styles.enterHint}><span>Go</span><CornerDownLeft size={12} /></div>)}
                      </div>
                    ))}
                  </div>
                ) : query ? (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}><AlertCircle size={40} /></div>
                    <p>No results found for "<strong>{query}</strong>"</p>
                    <span>Try searching for broader terms or check your spelling</span>
                  </div>
                ) : (
                  <div className={styles.searchHome}>
                    <div className={styles.searchTip}>
                      <div className={styles.tipIcon}><Sparkles size={20} /></div>
                      <div className={styles.tipContent}>
                        <span className={styles.tipTitle}>Quick Search Tips</span>
                        <p>Search for specific modules like "Accounting", "Sales", or "Inventory" to quickly jump to relevant tutorials and guides.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.modalFooter}>
                <div className={styles.footerHints}>
                  <div className={styles.hint}><kbd>↑↓</kbd> <span>navigate</span></div>
                  <div className={styles.hint}><kbd>↵</kbd> <span>select</span></div>
                  <div className={styles.hint}><kbd>esc</kbd> <span>close</span></div>
                </div>
                <div className={styles.footerBrand}>MAQSU SEARCH</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
  )
}

export default PopupSearch