import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search as SearchIcon, X, ChevronDown, FileText, ChevronRight, Loader2 } from "lucide-react";
import styles from "./styles.module.css";
import client from "../../../tina/__generated__/client";
let cachedSearchData = null;
const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    try {
      // ✅ If already cached, use it
      if (cachedSearchData) {
        setPosts(cachedSearchData);
        setLoading(false);
        return;
      }

      setLoading(true);

      const result = await client.queries.categoriesConnection();

      const allCategories =
        result?.data?.categoriesConnection?.edges?.map(
          (edge) => edge.node
        ) || [];

      // ✅ Save to cache
      cachedSearchData = allCategories;

      setPosts(allCategories);
    } catch (err) {
      console.error("Error fetching Tina data:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);
  /* -------------------------
     🔥 Build Global Search Index from Tina Data
  ------------------------- */
  const searchIndex = useMemo(() => {
  if (!posts || !Array.isArray(posts)) return [];

  const items = [];

  posts.forEach((category) => {
    // Get the base slug from the filename or a field (e.g., 'accounting' or 'inventory')
    // For this example, I'll assume you want the URL to match the category title/slug
    const baseSlug = category.title?.toLowerCase().replace(/\s+/g, '-') || "docs";

    category.groupSections?.forEach((group) => {
      // Add the group
      items.push({
        title: group.title,
        link: `/${baseSlug}/${group.link}`,
        category: category.title, // Now shows "Accounting" or "Inventory"
      });

      // Add nested sections
      group.sections?.forEach((section) => {
        let finalLink = section.link;
        if (finalLink.startsWith("/")) {
          finalLink = `/${baseSlug}${finalLink}`;
        } else if (!finalLink.includes("#")) {
          finalLink = `/${baseSlug}/${group.link.split("#")[0]}#${finalLink}`;
        } else {
          finalLink = `/${baseSlug}/${finalLink}`;
        }

        items.push({
          title: section.title,
          link: finalLink,
          category: group.title,
        });
      });
    });
  });

  return items;
}, [posts]);
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
          disabled={loading}
          onClick={() => setShowDropdown(!showDropdown)}
          className={styles.dropDownTopic}
        >
          <span>All Topics</span>
          {loading ? (
            <Loader2 className={styles.spinner} size={16} />
          ) : (
            <ChevronDown className={showDropdown ? styles.rotate180 : ""} size={16} />
          )}
        </button>

        {showDropdown && posts && (
          <div className={styles.megaMenuContainer}>
            <div className={styles.megaMenuGrid}>
              {posts.map((category, index) => {
                // Create a URL-friendly slug from the category title
                const baseSlug = category.title?.toLowerCase().replace(/\s+/g, '-') || "docs";

                return (
                  <div key={index} className={styles.megaMenuColumn}>
                    {/* Category Title - Acts as the Header */}
                    <h3 className={styles.categoryTitle}>{category.title}</h3>

                    {/* Map through the Group Sections within this file */}
                    <div className={styles.groupList}>
                      {category.groupSections?.map((group) => (
                        <a
                          key={group.link}
                          href={`/${baseSlug}/${group.link}`}
                          className={styles.megaMenuItem}
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className={styles.itemText}>
                            <span className={styles.itemTitle}>{group.title}</span>
                            {/* If your Tina schema has a 'description' field, show it here */}
                            {group.description && (
                              <p className={styles.itemDescription}>{group.description}</p>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optional: Right-side Promo Area (matching the Microsoft sample) */}
            <div className={styles.promoSection}>
              <span className={styles.promoTag}>HIGHLIGHTS</span>
              <h2 className={styles.promoTitle}>Release Notes</h2>
              <ul className={styles.promoList}>
                <li>
                  <h3 className={styles.promoItemTitle}>Version 3.9.0 Released</h3>
                </li>
                <li>
                  <h3 className={styles.promoItemTitle}>Version 4.0 Released</h3>
                </li>
                <li>
                  <h3 className={styles.promoItemTitle}>Version 4.1 Released</h3>
                </li>
                <li>
                  <h3 className={styles.promoItemTitle}>Version 5.0 Released</h3>
                </li>
              </ul>
                <span className={styles.promoTag}>LATEST UPDATE</span>
                <h3 className={styles.promoItemTitle}>Version 5.2 Released</h3>
                  <p>Read the release notes for the version 5.2.</p>
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
            disabled={loading}
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
