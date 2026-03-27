import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search as SearchIcon, X, ChevronDown, FileText, ChevronRight } from "lucide-react";
import styles from "./styles.module.css";
import useGlobalData from "@docusaurus/useGlobalData";
import Link from "@docusaurus/Link";

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

const MAX_RESULTS = 30;

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

  // Prefer concise titles when scores are close.
  score += Math.max(0, 30 - title.length * 0.15);

  return score;
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
        .map((t, idx) => {
          const slug = String(t?.link || "").replace(/^\//, "").split("/")[0];
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
     🔥 Build Global Search Index from Tina Data
  ------------------------- */
  const searchIndex = useMemo(() => {
  if (!categories || !Array.isArray(categories)) return [];

  const items = [];

  categories.forEach((category) => {
    const baseSlug = category.slug || category.uid || category.link || category.title?.toLowerCase().replace(/\s+/g, '-') || "docs";

    category.groupSections?.forEach((group) => {
      // Add the group
      items.push({
        title: group.title,
        link: `/${baseSlug}/${group.uid || group.link}`,
        category: category.title, // Now shows "Accounting" or "Inventory"
        content: stripMarkdown(group.body || group.description || ""),
      });

      // Add nested sections
      group.sections?.forEach((section) => {
        const raw = section.uid || section.link || "";
        const anchor = String(raw).includes("#")
          ? String(raw).split("#")[1]
          : String(raw).replace(/^\//, "");
        const groupSlug = group.uid || String(group.link || "").split("#")[0];
        const finalLink = `/${baseSlug}/${groupSlug}#${anchor}`;

        items.push({
          title: section.title,
          link: finalLink,
          category: group.title,
          content: stripMarkdown(section.body || section.description || section.content || ""),
        });
      });
    });
  });

  return items;
 }, [categories]);
  /* -------------------------
     🔥 Close Dropdown Outside Click
  ------------------------- */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------------
     🔥 ESC Close + Scroll Lock
  ------------------------- */
  const isActive = Boolean(query) || showDropdown;

  useEffect(() => {
    if (!isActive) return;

    function handleEsc(e) {
      if (e.key === "Escape") {
        setQuery("");
        setResults([]);
        setShowDropdown(false);
      }
    }

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

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
     🔥 Search Logic
  ------------------------- */
  const handleSearch = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const lowerValue = value.toLowerCase();

    const searchTerms = lowerValue.split(/\s+/).filter(Boolean);

    const ranked = searchIndex.map((item, index) => {
      const title = item?.title?.toLowerCase() || "";
      const category = item?.category?.toLowerCase() || "";
      const content = item?.content?.toLowerCase() || "";
      const haystack = `${title} ${category} ${content}`;
      const isMatch = searchTerms.every((term) => haystack.includes(term));

      if (!isMatch) return null;

      return {
        ...item,
        _rank: calculateSearchScore(item, lowerValue, searchTerms),
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
  };

  return (
    <div className={styles.SearchContainer}>
      {/* 🔥 Overlay */}
      {isActive && (
        <div
          className={styles.overlay}
          onClick={() => {
            setQuery("");
            setResults([]);
            setShowDropdown(false);
          }}
        />
      )}

      <div className={styles.searchBar}>
        {/* 🔽 Topics Dropdown */}
      <div className={styles.topics} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className={styles.dropDownTopic}
        >
          <span>All Topics</span>
          <ChevronDown className={showDropdown ? styles.rotate180 : ""} size={16} />
        </button>

        {showDropdown && (
          <div className={styles.megaMenuContainer}>
            <div className={styles.megaMenuGrid}>
              {categories.map((category) => {
                const baseSlug = category.slug || category.uid || category.link || "docs";
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

                    {/* {category.description && (
                      <p className={styles.categoryDescription}>{category.description}</p>
                    )} */}

                    <div className={styles.groupList}>
                      {groups.map((group) => {
                        const groupSlug = group.uid || String(group.link || "").split("#")[0];
                        return (
                          <Link
                            key={`${baseSlug}-${groupSlug}`}
                            to={`/${baseSlug}/${groupSlug}`}
                            className={styles.megaMenuItem}
                            onClick={() => setShowDropdown(false)}
                          >
                            <div className={styles.itemText}>
                              <ChevronRight size={14} className={styles.itemLeadIcon} />
                              <span className={styles.itemTitle}>{group.title}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

        {/* 🔍 Search Input */}
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.input}
            placeholder="Search for keywords, article ..."
            aria-label="Search"
          />

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className={styles.reset}
          >
            {query ? <X size={16} /> : <SearchIcon size={16} />}
          </button>
        </form>

        {/* 🔎 Results */}
        {query && (
          <ul className={styles.resultsList}>
            {results.length > 0 ? (
              results.map((result, index) => (
                <li key={`${result.link}-${index}`}>
                  <a
                    href={result.link}
                    className={styles.resultWrapper}
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                    }}
                  >
                    {/* <div className={styles.resultIcon}> */}
                      <FileText size={16} />
                    {/* </div> */}
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
