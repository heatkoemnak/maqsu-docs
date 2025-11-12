import { client } from "../../../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useLocation } from "@docusaurus/router";
import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "../styles.module.css";
import { motion } from "framer-motion";
import { LiaAngleRightSolid } from "react-icons/lia";
import { HiHome, HiMiniChevronLeft, HiMiniChevronRight } from "react-icons/hi2";
import { CardGrid } from "../../Cards/CardGrid";
import { VideoPlayer } from "../../VideoPlayer/VideoPlayer";
import { ProcessFlow } from "../../ProcessFlow/ProcessFlow";
import SearchContent from "../../Search/SearchContent";
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
    console.log(path);
    const location = useLocation();
    console.log(location.pathname);
    const [posts, setPosts] = React.useState(null);
    console.log("posts:",posts);
    
  // ✅ Find "features" block and its items
        const featureBlock = salesData.blocks.find((b) => b._template === "features");
        const items = featureBlock?.items || [];
        console.log("items:",items);


        // ✅ Find current item index for page navigation
        const currentIndex = items.findIndex((item) => `/${item.link}` === location.pathname);
        console.log("currentIndex:",currentIndex);
        const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
        
        const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;
        console.log("nextItem:",prevItem);
        console.log("nextItem:",nextItem);


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

    return (
        <>

            <SearchContent/>
            <div className={clsx(styles.navbar)}>
                {posts?.map((post, i) => {

                    return (
                        <div key={i}>
                            {post?.breadcrumbs?.map((word, j) => {
                                return (
                                    <span key={j}>
                                        {j > 0 && <LiaAngleRightSolid />}
                                        <Link to={word?.link}>{word?.title}</Link>
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
           

            <div className={clsx(styles.container)}>
                <motion.div
                    className={clsx(styles.main)}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {posts?.map((post, i) => (
                        <motion.div
                            key={i}
                            className="list-group-item"
                            variants={itemVariants}
                            whileHover={{ scale: 1 }}
                            // whileTap={{ scale: 0.98 }}
                        >
                            <h2 className={clsx(styles.pageTitle)}>{post.title}</h2>
                            <TinaMarkdown 
                            content={post.body}  
                            components={{CardGrid: (props) => <CardGrid {...props} />,
                            VideoPlayer: (props) => <VideoPlayer {...props} />,
                            ProcessFlow: (props) => <ProcessFlow {...props} />,}}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className={clsx(styles.side)}
                    variants={containerVariantsSidebar}
                    initial="hidden"
                    animate="show"
                >
                    {posts?.how_to?.length > 0 && (
                        <>
                            <motion.h2 variants={itemVariantsSidebar}>How to</motion.h2>
                            <motion.div
                                className={clsx(styles.manageLinks)}
                                variants={containerVariantsSidebar}
                            >
                                {posts?.map((post, i) => (
                                    <React.Fragment key={i}>
                                        {post?.how_to?.map((item, j) => (
                                            <motion.div
                                                key={j}
                                                variants={itemVariantsSidebar}
                                                whileHover={{ scale: 1.05, color: "#059669" }}
                                            >
                                                <Link to={item.link}>{item.title}</Link>
                                            </motion.div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </motion.div>
                            <hr />
                        </>
                    )}
                    {/* <PageNavigation/> */}

                    <>
                        {posts?.map((post, i) => (
                            <React.Fragment key={i}>
                                {post?.managements?.length > 0 && (
                                    <motion.h2 variants={itemVariantsSidebar}>TABLE OF CONTENTS</motion.h2>
                                )}
                            </React.Fragment>
                        ))}
                        <motion.div
                            className={clsx(styles.manageLinks)}
                            variants={containerVariantsSidebar}
                        >
                            {posts?.map((post, i) => (
                                <React.Fragment key={i}>
                                    {post?.managements?.map((item, j) => (
                                        <motion.div
                                            key={j}
                                            variants={itemVariantsSidebar}
                                            whileHover={{ scale: 1.05, color: "#059669" }}
                                        >
                                            <Link to={item.link}>{item.title}</Link>
                                        </motion.div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </motion.div>
                    </>

                    {posts?.some(post => post?.related?.length > 0) && (
                        <>
                            <motion.span className={clsx(styles.CONTENT)} variants={itemVariantsSidebar}>Related Contents</motion.span>
                            <motion.p variants={itemVariantsSidebar}>
                            </motion.p>
                            <motion.div variants={containerVariantsSidebar}>
                                {posts?.map((post, i) => (
                                    <React.Fragment key={i}>
                                        {post?.related?.map((item, j) => (
                                            <motion.div
                                                key={j}
                                                variants={itemVariantsSidebar}
                                                whileHover={{ scale: 1.05, color: "#059669" }}
                                            >
                                                <Link to={item.link}>{item.title}</Link>
                                            </motion.div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </motion.div>
                        </>
                    )}

                    {/* {posts?.some(post => post?.next?.length > 0) && (
                        <>
                            <motion.h3 variants={itemVariantsSidebar}>Next</motion.h3>
                            <motion.p variants={itemVariantsSidebar}>
                                
                            </motion.p>
                            <motion.div variants={containerVariantsSidebar}>
                                {posts?.map((post, i) => (
                                    <React.Fragment key={i}>
                                        {post?.next?.map((item, j) => (
                                            <motion.div
                                                key={j}
                                                variants={itemVariantsSidebar}
                                                whileHover={{ scale: 1.05, color: "#059669" }}
                                            >
                                                <Link to={item.link}>{item.title}</Link>
                                            </motion.div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </motion.div>
                        </>
                    )} */}
                </motion.div>

               
                <section
                    key={prevItem?.link}
                    className={clsx(
                        styles.features)}
                    >
                    <div
                        className={clsx(
                        styles.pageNavigation)}
                    >
                        {posts?.some(post => post?.previous?.length > 0) && (
                            <>
                                {/* <motion.h3 variants={itemVariantsSidebar}>Next</motion.h3> */}
                                <motion.div variants={containerVariantsSidebar}>
                                    {posts?.map((post, i) => (
                                        <React.Fragment key={i}>
                                            {post?.previous?.map((item, j) => (
                                                <motion.div
                                                    key={j}
                                                    variants={itemVariantsSidebar}
                                                    whileHover={{ scale: 1.05, color: "#059669" }}
                                                    className={clsx(styles.LinkContainer)}
                                                >
                                                    <Link to={item.link} className={clsx(styles.Link)}>
                                                    <span className={clsx(styles.Title)}> {item.title}</span><br/>
                                                    <span className={clsx(styles.next)}>PEVIOUS</span>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </motion.div>
                            </>
                        )}
                        {posts?.some(post => post?.next?.length > 0) && (
                            <>
                                {/* <motion.h3 variants={itemVariantsSidebar}>Next</motion.h3> */}
                                <motion.div variants={containerVariantsSidebar}>
                                    {posts?.map((post, i) => (
                                        <React.Fragment key={i}>
                                            {post?.next?.map((item, j) => (
                                                <motion.div
                                                    key={j}
                                                    variants={itemVariantsSidebar}
                                                    whileHover={{ scale: 1.05, color: "#059669" }}
                                                    className={clsx(styles.LinkContainer)}
                                                >
                                                    <Link to={item.link} className={clsx(styles.Link)}>
                                                        <span className={clsx(styles.Title)}> {item.title}</span><br/>
                                                        <span className={clsx(styles.next)}>NEXT</span>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </motion.div>
                            </>
                        )}
                        </div>
                    </section>
            </div>
          
        </>
    );
}