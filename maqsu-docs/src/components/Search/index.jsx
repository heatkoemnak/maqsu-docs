import React, {useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { useLocation } from "@docusaurus/router";
import Link  from "@docusaurus/Link";
const salesData = require("../../../config/sales/index.json");
const purchaseData = require("../../../config/purchase/index.json");
const inventoryData = require("../../../config/inventory/index.json");
const accountingData = require("../../../config/accounting/index.json");
const gettingStartedData = require("../../../config/gettstarted/index.json");
const homeData = require("../../../config/homepage/index.json");
const Search = ({ title }) => {
  // console.log("Sales Data:", salesData);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(false);

  React.useEffect(() => {
    try {
      if (location.pathname === "/getting-started") setPageData(gettingStartedData);
      else if (location.pathname === "/sales") setPageData(salesData);
      else if (location.pathname === "/purchase") setPageData(purchaseData);
      else if (location.pathname === "/accounting") setPageData(accountingData);
      else if (location.pathname === "/inventory") setPageData(inventoryData);
      else if (location.pathname === "/settings") setPageData(gettingStartedData);
      else setPageData(homeData);
    } catch (err) {
      console.error("Error loading page data:", err);
    }
  }, [location.pathname]);

  // Handle search logic
  const handleSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);

    const filtered = pageData.blocks.map(block => {
        return block?.items?.filter(item => {
          const title = item?.title?.toLowerCase() || "";
          const body = item?.description?.toLowerCase() || "";
          return (
            title.includes(value.toLowerCase()) ||
            body.includes(value.toLowerCase())
          );
        });
      }
    )
    setResults(filtered);
    setLoading(false);
  };

  return (
    <div className="relative w-full">
      <form
        className={clsx(styles.form)}
        onSubmit={(e) => e.preventDefault()}
      >
        <button type="button" disabled>
          <svg
            width="17"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="search"
          >
            <path
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
              stroke="currentColor"
              strokeWidth="1.333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className={clsx(styles.input)}
          placeholder={`Search for ${title}`}
        />

        {query && (
          <button
            type="reset"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className={clsx(styles.reset)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </form>

      {/* Search results */}
      {loading && (
        <p className="text-sm text-gray-500 mt-2">Searching...</p>
      )}
        {results && results.length > 0 && (
          <ul className={clsx(styles.resultsList)}>
            {results.flat().map((result, idx) =>
              result?.title ? (
                <li key={idx} className={clsx(styles.resultLink)}>
                  <Link to={result.link} className={clsx(styles.resultLink)}>
                    {result?.title}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        )}
    </div>
  );
};

export default Search;
