import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search as SearchIcon, X, ChevronDown, FileText } from "lucide-react";
import styles from "./styles.module.css";
import useGlobalData from "@docusaurus/useGlobalData";
import Link from "@docusaurus/Link";

const MAX_RESULTS = 30;

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

const buildExcerpt = (content = "", max = 140) => {
  const clean = stripMarkdown(content);
  if (!clean) return "";
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}...` : clean;
};

/**
 * Follow your working link format:
 * account-receivable-invoices-createinvoice
 * not:
 * account-receivable-invoices-create-invoice
 */
const normalizeHeadingText = (text = "") =>
  String(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "")
    .replace(/-+/g, "");

const buildScopedHeadingId = ({
  groupUid = "",
  sectionId = "",
  headingText = "",
  usedIds = {},
}) => {
  const textSlug = normalizeHeadingText(headingText) || "section";
  const scopePrefix = `${groupUid}-${sectionId}`;
  const baseId = `${scopePrefix}-${textSlug}`;

  const nextCount = (usedIds[baseId] || 0) + 1;
  usedIds[baseId] = nextCount;

  return nextCount === 1 ? baseId : `${baseId}-${nextCount}`;
};

/**
 * Extract heading blocks from markdown.
 * Focus on ### / #### because these are the levels
 * you're using for searchable content blocks.
 */
const extractMarkdownBlocks = (markdown = "") => {
  const text = String(markdown || "").replace(/\r\n/g, "\n");
  const headingRegex = /^(#{3,4})\s+(.+?)$/gm;
  const matches = [...text.matchAll(headingRegex)];

  if (!matches.length) return [];

  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end =
      index + 1 < matches.length
        ? matches[index + 1].index ?? text.length
        : text.length;

    const level = match[1].length;
    const rawTitle = match[2].trim();
    const rawBlock = text.slice(start, end).trim();

    return {
      level,
      rawTitle,
      title: stripMarkdown(rawTitle),
      content: stripMarkdown(rawBlock),
    };
  });
};

const buildSearchItem = ({
  title,
  link,
  category,
  content,
  isHeadingBlock = false,
  headingLevel = null,
}) => ({
  title: title || "",
  link: link || "#",
  category: category || "",
  content: stripMarkdown(content || ""),
  isHeadingBlock,
  headingLevel,
});

const dedupeItems = (items = []) => {
  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.link}::${item.title}::${item.category}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const calculateSearchScore = (item, query, searchTerms) => {
  const title = (item?.title || "").toLowerCase();
  const category = (item?.category || "").toLowerCase();
  const content = (item?.content || "").toLowerCase();
  const safeQuery = (query || "").toLowerCase().trim();

  let score = 0;

  if (title === safeQuery) score += 300;
  if (title.startsWith(safeQuery)) score += 180;
  if (title.includes(safeQuery)) score += 120;
  if (category.includes(safeQuery)) score += 60;
  if (content.includes(safeQuery)) score += 45;

  searchTerms.forEach((term) => {
    if (title.includes(term)) score += 24;
    if (title.startsWith(term)) score += 20;
    if (category.includes(term)) score += 10;
    if (content.includes(term)) score += 5;
  });

  if (item?.isHeadingBlock) score += 35;

  score += Math.max(0, 30 - title.length * 0.15);

  return score;
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMegaMenuFullscreen, setIsMegaMenuFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);

  const globalData = useGlobalData();
  const topics = globalData?.["topics-data"]?.default?.topics ?? [];
  const categoriesBySlug = globalData?.["categories-data"]?.default?.bySlug ?? {};

  const categories = useMemo(() => {
    const list = Object.entries(categoriesBySlug).map(([slug, data]) => ({
      slug,
      ...(data || {}),
    }));

    const order = new Map(
      topics
        .map((topic, idx) => {
          const slug = String(topic?.link || "")
            .replace(/^\//, "")
            .split("/")[0];
          return slug ? [slug, idx] : null;
        })
        .filter(Boolean)
    );

    list.sort((a, b) => {
      const oa = order.has(a.slug) ? order.get(a.slug) : Number.POSITIVE_INFINITY;
      const ob = order.has(b.slug) ? order.get(b.slug) : Number.POSITIVE_INFINITY;

      if (oa !== ob) return oa - ob;
      return String(a.title || a.slug).localeCompare(String(b.title || b.slug));
    });

    return list;
  }, [categoriesBySlug, topics]);


  /* -------------------------
     Keyboard Shortcuts
  ------------------------- */

  useEffect(() => {
  const handleKeyDown = (e) => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");

    if (
      (isMac && e.metaKey && e.key === "f") || // Cmd + F
      (!isMac && e.ctrlKey && e.key === "f")   // Ctrl + F
    ) {
      e.preventDefault();

      inputRef.current?.focus();
      setShowDropdown(false); // optional
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, []);

  /* -------------------------
     Build Search Index
  ------------------------- */
  const searchIndex = useMemo(() => {
    if (!Array.isArray(categories)) return [];

    const items = [];

    categories.forEach((category) => {
      const baseSlug =
        category.slug ||
        category.uid ||
        category.link ||
        category.title?.toLowerCase().replace(/\s+/g, "-") ||
        "docs";

      (category.groupSections || []).forEach((group) => {
        const groupSlug = group.uid || String(group.link || "").split("#")[0];
        const groupLink = `/${baseSlug}/${groupSlug}`;

        items.push(
          buildSearchItem({
            title: group.title,
            link: groupLink,
            category: category.title,
            content: group.body || group.description || "",
          })
        );

        const groupBlocks = extractMarkdownBlocks(group.body || group.description || "");
        if (groupBlocks.length) {
          const usedGroupIds = {};

          groupBlocks.forEach((block) => {
            const id = buildScopedHeadingId({
              groupUid: group.uid || groupSlug,
              sectionId: "group",
              headingText: block.rawTitle || block.title,
              usedIds: usedGroupIds,
            });

            items.push(
              buildSearchItem({
                title: block.title,
                link: `${groupLink}#${id}`,
                category: `${category.title} → ${group.title}`,
                content: block.content,
                isHeadingBlock: true,
                headingLevel: block.level,
              })
            );
          });
        }

        (group.sections || []).forEach((section) => {
          const raw = section.uid || section.link || "";
          const rawString = String(raw);

          const subId = rawString.includes("#")
            ? rawString.split("#")[1]
            : rawString.replace(/^\//, "");

          const sectionBaseLink = `/${baseSlug}/${groupSlug}`;
          const sectionLink = subId
            ? `${sectionBaseLink}#${subId}`
            : sectionBaseLink;

          const sectionBody =
            section.body || section.description || section.content || "";

          items.push(
            buildSearchItem({
              title: section.title,
              link: sectionLink,
              category: group.title,
              content: sectionBody,
            })
          );

          const blocks = extractMarkdownBlocks(sectionBody);
          const usedHeadingIds = {};

          blocks.forEach((block) => {
            const uniqueId = buildScopedHeadingId({
              groupUid: group.uid || groupSlug,
              sectionId: subId,
              headingText: block.rawTitle || block.title,
              usedIds: usedHeadingIds,
            });

            items.push(
              buildSearchItem({
                title: block.title,
                link: `${sectionBaseLink}#${uniqueId}`,
                category: `${group.title} → ${section.title}`,
                content: block.content,
                isHeadingBlock: true,
                headingLevel: block.level,
              })
            );
          });
        });
      });
    });

    return dedupeItems(items);
  }, [categories]);

  /* -------------------------
     Reset active selection when results change
  ------------------------- */
  useEffect(() => {
    itemRefs.current = [];
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  /* -------------------------
     Scroll selected item into view
  ------------------------- */
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  /* -------------------------
     Close dropdown on outside click
  ------------------------- */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsMegaMenuFullscreen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------------
     ESC close + scroll lock
  ------------------------- */
  const isActive = Boolean(query) || showDropdown;

  useEffect(() => {
    if (!isActive) return;

    function handleEsc(event) {
      if (event.key === "Escape") {
        setQuery("");
        setResults([]);
        setActiveIndex(-1);
        setShowDropdown(false);
        setIsMegaMenuFullscreen(false);
      }
    }

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.addEventListener("keydown", handleEsc);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isActive]);

  /* -------------------------
     Search logic
  ------------------------- */
  const handleSearch = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const normalizedQuery = value.toLowerCase().trim();
    const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean);

    const ranked = searchIndex
      .map((item, index) => {
        const title = (item?.title || "").toLowerCase();
        const category = (item?.category || "").toLowerCase();
        const content = (item?.content || "").toLowerCase();
        const haystack = `${title} ${category} ${content}`;

        const isMatch = searchTerms.every((term) => haystack.includes(term));
        if (!isMatch) return null;

        return {
          ...item,
          _rank: calculateSearchScore(item, normalizedQuery, searchTerms),
          _index: index,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (b._rank !== a._rank) return b._rank - a._rank;
        return a._index - b._index;
      })
      .slice(0, MAX_RESULTS)
      .map(({ _rank, _index, ...item }) => item);

    setResults(ranked);
    setShowDropdown(false);
  };
const handleInputKeyDown = (event) => {
  if (!results.length) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
  }

  if (event.key === "Enter") {
    event.preventDefault();

    const target = activeIndex >= 0 ? results[activeIndex] : results[0];
    if (!target?.link) return;

    // close UI first
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    setShowDropdown(false);
    setIsMegaMenuFullscreen(false);

    const currentUrl = `${window.location.pathname}${window.location.hash}`;
    const targetUrl = new URL(target.link, window.location.origin);
    const targetPathWithHash = `${targetUrl.pathname}${targetUrl.hash}`;

    if (currentUrl === targetPathWithHash) return;

    // same page, different hash
    if (window.location.pathname === targetUrl.pathname) {
      window.location.hash = targetUrl.hash;
      return;
    }

    // different page
    window.location.href = target.link;
  }
};
  return (
    <div className={styles.SearchContainer}>
      {isActive && (
        <div
          className={styles.overlay}
          onClick={() => {
            setQuery("");
            setResults([]);
            setActiveIndex(-1);
            setShowDropdown(false);
          }}
        />
      )}

      <div className={styles.searchBar}>
        <div className={styles.topics} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              const next = !showDropdown;
              setShowDropdown(next);
              if (!next) setIsMegaMenuFullscreen(false);
            }}
            className={styles.dropDownTopic}
          >
            <span>All Topics</span>
            <ChevronDown
              className={showDropdown ? styles.rotate180 : ""}
              size={16}
            />
          </button>

          {showDropdown && (
            <div
              className={`${styles.megaMenuContainer} ${
                isMegaMenuFullscreen ? styles.megaMenuContainerFullscreen : ""
              }`}
            >
              <div className={styles.megaMenuInner}>
                <div className={styles.megaMenuGrid}>
                  {categories.map((category) => {
                    const baseSlug =
                      category.slug || category.uid || category.link || "docs";
                    const groups = category.groupSections || [];

                    return (
                      <div key={baseSlug} className={styles.megaMenuColumn}>
                        <Link
                          to={`/${baseSlug}`}
                          className={styles.categoryTitleLink}
                          onClick={() => setShowDropdown(false)}
                        >
                          {category.title || baseSlug}
                        </Link>

                        <div className={styles.groupList}>
                          {groups.map((group) => {
                            const groupSlug =
                              group.uid || String(group.link || "").split("#")[0];

                            return (
                              <Link
                                key={`${baseSlug}-${groupSlug}`}
                                to={`/${baseSlug}/${groupSlug}`}
                                className={styles.megaMenuItem}
                                onClick={() => setShowDropdown(false)}
                              >
                                <span className={styles.itemTitle}>
                                  {group.title}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.megaMenuFooter}>
                  <button
                    type="button"
                    className={styles.megaMenuFooterLink}
                    onClick={() => setIsMegaMenuFullscreen((prev) => !prev)}
                  >
                    {isMegaMenuFullscreen
                      ? "Exit full screen"
                      : "Browse all Topics"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {/* <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className={styles.input}
            placeholder="Search for keywords, article ..."
            aria-label="Search"
          /> */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className={styles.input}
            placeholder="Search for keywords, article ...                                                             Ctrl + F"
            aria-label="Search"
          />

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setActiveIndex(-1);
            }}
            className={styles.reset}
          >
            {query ? <X size={16} /> : <SearchIcon size={16} />}
          </button>
        </form>

        {query && (
          <ul className={styles.resultsList} role="listbox" aria-label="Search results">
            {results.length > 0 ? (
              results.map((result, index) => (
                <li
                  key={`${result.link}-${index}`}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={index === activeIndex ? styles.activeItem : ""}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <a
                    href={result.link}
                    className={styles.resultWrapper}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                      setActiveIndex(-1);
                    }}
                  >
                    <FileText size={26} />
                    <div className={styles.resultContent}>
                      <span className={styles.resultTitle}>
                        {result.title}
                      </span>
                      <span className={styles.resultCategory}>
                        {result.category}
                      </span>
                      {result.content ? (
                        <span className={styles.resultExcerpt}>
                          {buildExcerpt(result.content)}
                        </span>
                      ) : null}
                    </div>
                  </a>
                </li>
              ))
            ) : (
              <li className={styles.noResults}>
                <p>No results found for "{query}"</p>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;