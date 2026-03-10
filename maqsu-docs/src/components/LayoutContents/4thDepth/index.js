import { client } from "../../../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useLocation } from "@docusaurus/router";
import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "../styles.module.css";
import { motion } from "framer-motion";
import { LiaAngleRightSolid } from "react-icons/lia";
import { FaLink } from "react-icons/fa6";
import { CardGrid } from "../../Cards/CardGrid";
import { VideoPlayer } from "../../VideoPlayer/VideoPlayer";
import { ProcessFlow } from "../../ProcessFlow/ProcessFlow";

import { Lists } from "../../Cards/Lists";
import { Noted } from "../../Noted/Noted";
import { Steps } from "../../Steps/Steps";
import { RiArrowLeftDoubleLine,RiArrowRightDoubleLine } from "react-icons/ri";


import Page from "../../Page";
import CustomTabsPage from "../../CustomTabsPage";
import { HeroContent } from "../../HeroContent";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Navbar from "../../Navbar/Navbar";
const salesData = require("../../../../config/gettstarted/index.json");


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const containerVariantsSidebar = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariantsSidebar = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FourthDepth({path}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const location = useLocation();
    const [posts, setPosts] = React.useState(null);
    console.log(location.pathname);
//  console.log(posts.map((post) => post?.body))
        // ✅ Find "features" block and its items
        const featureBlock = salesData.blocks.find((b) => b._template === "features");
        const items = featureBlock?.items || [];

        // ✅ Find current item index for page navigation
        const currentIndex = items.findIndex((item) => `/${item.link}` === location.pathname);
        const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
        const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

    React.useEffect(() => {
        async function fetchData() {
            try {
                const result = await client.queries.pages({
                relativePath: path,
                });
                const postsArray = result?.data?.pages ? [result.data.pages] : [];
                setPosts(postsArray);
            } catch (err) {
                console.error("Error fetching Tina data:", err);
            }
        }
        fetchData();
    }, []);

    //  const location = useLocation();
    //   const { siteConfig } = useDocusaurusContext();
    //   console.log("pathname:",location.pathname);

    //   // Example mapping based on pathname
    //   const getPageTitle = (pathname) => {
    //     if (pathname.startsWith("/sales")) return "Sales";
    //     if (pathname.startsWith("/purchase")) return "Purchase";
    //     if (pathname.startsWith("/inventory")) return "Inventory";

    //     // default fallback
    //     return data.title ? data.title : siteConfig.title;

    //   };

    //   const pageTitle = getPageTitle(location.pathname);

    return (
        <>
            {/* <HeroContent data={"Hello"} index={0}/> */}
            <Navbar/>
            {/* {
                sidebarOpen &&
                    <div className={clsx(styles.navbar)}>
                        {posts?.map((post, i) => {
                            return (
                                <div key={i} className={clsx(styles.Link)}>
                                    {post?.breadcrumbs?.map((word, j) => {
                                        return (
                                            <span key={j}>
                                                {j > 0 && <LiaAngleRightSolid size={10}/>}
                                                <Link to={word?.link}>{word?.title}</Link>
                                            </span>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                    } */}

            {/* <div className={clsx(styles.main)}>
                <div className={clsx(styles.side)}>
                    {posts?.some(post => post?.related?.length > 0) && (
                        <div className={clsx(styles.related_link)}>
                            <span className={clsx(styles.CONTENT)}>Related Contents</span>
                            <p>
                            </p>
                            <div>
                                {posts?.map((post, i) => (
                                    <React.Fragment key={i}>
                                        {post?.related?.map((item, j) => (
                                            <div
                                                key={j}
                                            >
                                                <Link to={item.link}><span className={clsx(styles.LinkText)}>{item.title}</span></Link>
                                            </div>

                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {posts?.map((post, i) => (
                    <div
                        key={i}
                        className="list-group-item"
                    >
                        <h2 className={clsx(styles.pageTitle)}>{post.title}</h2>
                        <TinaMarkdown
                        content={post.body}
                        components={{CardGrid: (props) => <CardGrid {...props} />,
                        tabsesctions: (props) => <CustomTabsPage {...props} />,
                        VideoPlayer: (props) => <VideoPlayer {...props} />,
                        Lists: (props) => <Lists {...props} />,
                        ProcessFlow: (props) => <ProcessFlow {...props} />,
                        Noted: (props) => <Noted {...props}/>,
                        Steps: (props) => <Steps {...props}/>,}}
                        />
                    </div>
                ))}
            </div> */}

              <Page sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                <section
                    key={prevItem?.link}
                    className={clsx(styles.features)}
                >
                    <div className={clsx(styles.pageNavigation)}>
                        {posts?.some(post => post?.previous?.length > 0) && (
                            <motion.div variants={containerVariantsSidebar} className={clsx(styles.prev)}>
                                {posts?.map((post, i) => (
                                    <React.Fragment key={i}>
                                        {post?.previous?.map((item, j) => (
                                            <motion.div
                                                key={j}
                                                variants={itemVariantsSidebar}
                                                whileHover={{color: "#059669" }}
                                                className={clsx(styles.LinkContainer)}
                                            >
                                                <Link to={item.link} className={clsx(styles.Link)}>
                                                    <span className={clsx(styles.PREV)}>PEVIOUS</span>
                                                    <span className={clsx(styles.PREV_title)}> <RiArrowLeftDoubleLine size={17} />{item.title}</span>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </motion.div>
                        )}
                        {posts?.some(post => post?.next?.length > 0) && (
                            <motion.div variants={containerVariantsSidebar} className={clsx(styles.next)}>
                                {posts?.map((post, i) => (
                                    <React.Fragment key={i} >
                                        {post?.next?.map((item, j) => (
                                            <motion.div
                                                key={j}
                                                variants={itemVariantsSidebar}
                                                whileHover={{color: "#059669" }}
                                                className={clsx(styles.LinkContainer)}
                                            >
                                                <Link to={item.link} className={clsx(styles.Link)}>
                                                    <span className={clsx(styles.NEXT)}>NEXT</span>
                                                    <span className={clsx(styles.NEXT_title)}>{item.title} <RiArrowRightDoubleLine size={17} /></span>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>

        </>
    );
}