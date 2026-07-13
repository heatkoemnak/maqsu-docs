import useGlobalData from '@docusaurus/useGlobalData';
import { AnimatePresence,motion } from 'framer-motion';
import React, { useMemo } from 'react'
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
const cleanUrl = (url = "") => String(url).replace(/\/+/g, "/");


const ShowTopic = () => {
    const globalData = useGlobalData();
      const topicsData = useGlobalData()?.["topics-data"]?.default?.topics ?? [];
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
  return (
    <div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className={styles.megaMenu}
          >
            <div className={styles.megaMenuGrid}>
              {categories.map((cat) => (
                <div key={cat.slug} className={styles.megaMenuCol}>
                  <Link to={cleanUrl(`/${cat.slug}`)} className={styles.megaMenuCategory}>{cat.title}</Link>
                  <div className={styles.megaMenuLinks}>
                    {(cat.groupSections || []).slice(0, 10).map((group) => {
                      const gSlug = group.uid || String(group.link || "").split("#")[0];
                      return (<Link key={gSlug} to={cleanUrl(`/${cat.slug}/${gSlug}`)} className={styles.megaMenuLink} >{group.title}</Link>);
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ShowTopic