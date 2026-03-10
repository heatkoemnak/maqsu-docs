import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search as SearchIcon, X, ChevronDown, FileText, ChevronRight } from "lucide-react";
import styles from "./styles.module.css";
import useGlobalData from "@docusaurus/useGlobalData";
import Link from "@docusaurus/Link";

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
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setQuery("");
        setResults([]);
        setShowDropdown(false);
      }
    }

    if (query || showDropdown) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [query, showDropdown]);

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

    const filtered = searchIndex.filter((item) => {
      const title = item?.title?.toLowerCase() || "";
      return title.includes(lowerValue);
    });

    setResults(filtered);
  };

  const isActive = query || showDropdown;

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
                              <span className={styles.itemTitle}>{group.title}</span>
                              {/* <ChevronRight size={14} className={styles.itemChevron} /> */}
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
