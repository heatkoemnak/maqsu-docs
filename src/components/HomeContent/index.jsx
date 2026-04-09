import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import useGlobalData from "@docusaurus/useGlobalData";
import { Hero } from "../Hero";
import { MdGridView } from "react-icons/md";
import { RiListCheck2 } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";
const pageData = require("../../../config/homepage/index.json");
const blocks = pageData.blocks;
import styled from 'styled-components';

const SkeletonCard = () => (
  <div className="card skeleton-card">
    <div className="card-content">
      <div className="card-header">
        <div className="card-icon skeleton-pulse" />
        <div className="card-info" style={{ width: '100%' }}>
          <div className="skeleton-line skeleton-pulse" style={{ width: '70%', height: '1.25rem', marginBottom: '0.5rem' }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: '40%', height: '0.75rem' }} />
        </div>
      </div>
      <div className="skeleton-line skeleton-pulse" style={{ width: '100%', height: '0.85rem', marginTop: '1rem' }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: '90%', height: '0.85rem', marginTop: '0.5rem' }} />
    </div>
  </div>
);

export default function HomeContent({cardList = []}) {

  const [gridView, setGridView] = React.useState(true);
  const globalData = useGlobalData();
  const posts = globalData?.["topics-data"]?.default?.topics ?? [];




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

  return (
      <StyledWrapper>

    <div className={clsx(styles.container)}>
      <div className={clsx(styles.hero_page)}>
        {blocks
          ? blocks.map(function (block, i) {
            switch (block._template) {
              case "hero":
                return (
                  <div data-tinafield={`blocks.${i}`} key={i + block._template}>
                    <Hero data={block} index={i} />
                  </div>
                );
              default:
                return null;
            }
          })
          : null}
      </div>

      <div className={clsx(styles.features)}>
        <div className="header-section">
          <div className="title-wrapper">
            <h2 className="all-categories">All Categories</h2>
            {/* <div className="category-count">{cardList.length} items</div> */}
          </div>
          <div className="view-controls">
            <button
              onClick={() => setGridView(false)}
              className={clsx("view-btn", !gridView && "active")}
              aria-label="List view"
            >
              <RiListCheck2 size={20} />
            </button>
            <button
              onClick={() => setGridView(true)}
              className={clsx("view-btn", gridView && "active")}
              aria-label="Grid view"
            >
              <MdGridView size={20} />
            </button>
          </div>
        </div>

        <div className={clsx("cards-container", gridView ? "grid-layout" : "list-layout")}>
          {posts.length === 0 ? (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">No categories found</h3>
                <span className="card-description">
                  Check `topics/topic.mdx` and rebuild the site.
                </span>
              </div>
            </div>
          ) : (
            posts.map((card, index) => (
              <Link key={index + 1} to={card.link} className="card-link">
                <article className="card">
                  <div className="card-content">
                    <div className="card-header">
                      {card.icon && (
                        <div className="card-icon">
                          <img src={card.icon} alt="" />
                        </div>
                      )}
                      <div className="card-info">
                        <h3 className="card-title">{card.title}</h3>
                        <time className="card-time">
                          <TimeAgo date={card?.date} />
                        </time>
                      </div>
                    </div>
                    <span className="card-description">{card.description}</span>
                  </div>
                </article>
              </Link>
            ))
          )}
          </div>

        {/* <div className={clsx("cards-container", gridView ? "grid-layout" : "list-layout")}>
          {posts.map((card, index) => (
            <Link key={index + 1} to={card.link} className="card-link">
              <article className="card">
                <div className="card-content">
                  <div className="card-header">
                    {card.icon && (
                      <div className="card-icon">
                        <img src={card.icon} alt="" />
                      </div>
                    )}
                    <div className="card-info">
                      <h3 className="card-title">{card.title}</h3>
                      <time className="card-time">
                        <TimeAgo date={card?.date} />
                      </time>
                    </div>
                  </div>
                  <p className="card-description">{card.description}</p>
                </div>
              </article>
            </Link>
          ))}
        </div> */}
      </div>
    </div>
      </StyledWrapper>

    );
}



const StyledWrapper = styled.div`

/* ─── Skeleton Animations ────────────────────────────────────── */
  .skeleton-pulse {
    background: #e2e8f0;
    position: relative;
    overflow: hidden;
  }

  .skeleton-pulse::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  .skeleton-line {
    border-radius: 4px;
  }

  .skeleton-card {
    pointer-events: none;
    border-color: #f1f5f9 !important;
  }

  .skeleton-card .card-icon {
    background: #e2e8f0 !important;
    box-shadow: none;
  }

  /* Ensure your existing .card style is preserved */
  .card {
    background: #ffffff;
    border: 1px solid #e2e8f0 !important;
    border-radius: 16px;
    padding: 1.5rem;
    height: 100%;
  }



  /* ─── Header Section ─────────────────────────────────────────── */
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
    padding: 0 0.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .title-wrapper {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .all-categories {
    color: #1a365d;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .category-count {
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    background: #f1f5f9;
    border-radius: 20px;
  }

  /* ─── View Controls ─────────────────────────────────────────── */
  .view-controls {
    display: flex;
    gap: 0.5rem;
    background: #f8fafc !important;
    padding: 0.25rem;
    border-radius: 10px;
    border: 1px solid #eeeff1 !important;
  }

  .view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .view-btn:hover {
    background: #e2e8f0 !important;
    color: #334155;
  }

  .view-btn.active {
    background: #ffffff;
    color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* ─── Cards Container ─────────────────────────────────────────── */
  .cards-container {
    display: grid;
    gap: 1.5rem;
    width: 100%;
  }

  .cards-container.grid-layout {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .cards-container.list-layout {
    grid-template-columns: 1fr;
  }

  /* ─── Card Link ─────────────────────────────────────────── */
  .card-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .card-link:hover {
    text-decoration: none;
  }

  /* ─── Card ─────────────────────────────────────────── */
  .card {
    background: #ffffff;
    border: 1px solid #deebfc !important;
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    height: 100%;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3f6a81 0%, #3c7bac 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }

  .card:hover::before {
    opacity: 1;
  }

  /* ─── List View Specific ─────────────────────────────────────────── */
  .list-layout .card {
    padding: 2rem;
  }

  .list-layout .card-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .list-layout .card-header {
    flex-direction: row;
    gap: 1.5rem;
  }

  /* ─── Card Content ─────────────────────────────────────────── */
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    height: 100%;
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .card-icon {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2d5774 0%, #2b5876 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.45rem;
    box-shadow: 0 4px 12px rgba(215, 219, 236, 0.2);
  }

  .card-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .card-info {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    line-height: 1.1;
    display: -webkit-box;
    // -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card:hover .card-title {
    color: #3b82f6;
  }

  .card-time {
    font-size: 0.775rem;
    color: #64748b !important;
    font-weight: 500;
    // display: inline-flex;
    align-items: center;
    // gap: 0.25rem;
  }

  // .card-time::before {
  //   content: '•';
  //   color: #cbd5e1;
  // }

  .card-description {
    font-size: 0.85rem;
    line-height: 1.6;
    color: #323232 !important;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .list-layout .card-description {
    -webkit-line-clamp: 2;
  }

  /* ─── Responsive Design ─────────────────────────────────────────── */
  @media (max-width: 768px) {
    .header-section {
      flex-direction: column;
      align-items: flex-start;
    }

    .all-categories {
      font-size: 1.75rem;
    }

    .cards-container.grid-layout {
      grid-template-columns: 1fr;
    }

    .card {
      padding: 1.25rem;
    }

    .list-layout .card {
      padding: 1.5rem;
    }

    .card-icon {
      width: 40px;
      height: 40px;
    }

    .card-title {
      font-size: 1.125rem;
    }
  }

  @media (max-width: 480px) {
    .all-categories {
      font-size: 1.5rem;
    }

    .view-controls {
      width: 100%;
      justify-content: flex-end;
    }

    .card-header {
      gap: 0.75rem;
    }

    .card-description {
      font-size: 0.875rem;
    }
  }

  /* ─── Dark Mode Support ─────────────────────────────────────────── */
  @media (prefers-color-scheme: dark) {
    .card {
      background: #ffffff;
      border-color: #334155;
    }

    .card:hover {
      border-color: #475569;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    }

    .all-categories {
      color: #f1f5f9;
    }

    .category-count {
      background: #334155;
      color: #cbd5e1;
    }

    .view-controls {
      background: #1e293b;
      border-color: #334155;
    }

    .view-btn.active {
      background: #334155;
    }

    .card-title {
      color: #f1f5f9;
    }

    .card:hover .card-title {
      color: #60a5fa;
    }

    .card-description {
      color: #cbd5e1;
    }

    .card-time {
      color: #94a3b8;
    }
  }

  /* ─── Animations ─────────────────────────────────────────── */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .card {
    animation: fadeIn 0.4s ease-out backwards;
  }

  .card:nth-child(1) { animation-delay: 0.05s; }
  .card:nth-child(2) { animation-delay: 0.1s; }
  .card:nth-child(3) { animation-delay: 0.15s; }
  .card:nth-child(4) { animation-delay: 0.2s; }
  .card:nth-child(5) { animation-delay: 0.25s; }
  .card:nth-child(6) { animation-delay: 0.3s; }
`;
