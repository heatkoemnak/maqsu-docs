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


const SkeletonCard = () => (
  <div className={clsx(styles.card, styles.skeletonCard)}>
    <div className={styles.cardContent}>
      <div className={styles.cardHeader}>
        <div className={clsx(styles.cardIcon, styles.skeletonPulse)} />
        <div className={styles.cardInfo} style={{ width: '100%' }}>
          <div className={clsx(styles.skeletonLine, styles.skeletonPulse)} style={{ width: '70%', height: '1.25rem', marginBottom: '0.5rem' }} />
          <div className={clsx(styles.skeletonLine, styles.skeletonPulse)} style={{ width: '40%', height: '0.75rem' }} />
        </div>
      </div>
      <div className={clsx(styles.skeletonLine, styles.skeletonPulse)} style={{ width: '100%', height: '0.85rem', marginTop: '1rem' }} />
      <div className={clsx(styles.skeletonLine, styles.skeletonPulse)} style={{ width: '90%', height: '0.85rem', marginTop: '0.5rem' }} />
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

      <div className={styles.features}>
        <div className={styles.headerSection}>
          <div className={styles.titleWrapper}>
            <div>
              <h2 className={styles.allCategories}>All Categories</h2>
            </div>
             <div className={clsx(styles.GridControlIcons)}>
              <RiListCheck2 className={clsx(styles.viewBtn, !gridView && styles.active)} onClick={() => setGridView(false)} size={40} />
              <MdGridView className={clsx(styles.viewBtn, gridView && styles.active)}  onClick={() => setGridView(true)} size={40} />
             </div>
          </div>
          <div className={styles.viewControls}>

            <button
              onClick={() => setGridView(false)}
              className={clsx(styles.viewBtn, !gridView && styles.active)}
              aria-label="List view"
            >
              <RiListCheck2 size={20} />
            </button>
            <button
              onClick={() => setGridView(true)}
              className={clsx(styles.viewBtn, gridView && styles.active)}
              aria-label="Grid view"
            >
              <MdGridView size={20} />
            </button>
          </div>
        </div>

        <div className={clsx(styles.cardsContainer, gridView ? styles.gridLayout : styles.listLayout)}>
          {posts.length === 0 ? (
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>No categories found</h3>
                <span className={styles.cardDescription}>
                  Check `topics/topic.mdx` and rebuild the site.
                </span>
              </div>
            </div>
          ) : (
            posts.map((card, index) => (
              <Link key={index + 1} to={card.link} className={styles.cardLink}>
                <article className={styles.card}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      {card.icon && (
                        <div className={styles.cardIcon}>
                          <img src={card.icon} alt="" />
                        </div>
                      )}
                      <div className={styles.cardInfo}>
                        <h3 className={styles.cardTitle}>{card.title}</h3>
                        <time className={styles.cardTime}>
                          <TimeAgo date={card?.date} />
                        </time>
                      </div>
                    </div>
                    <span className={styles.cardDescription}>{card.description}</span>
                  </div>
                </article>
              </Link>
            ))
          )}
          </div>

      </div>
    </div>
  );
}




