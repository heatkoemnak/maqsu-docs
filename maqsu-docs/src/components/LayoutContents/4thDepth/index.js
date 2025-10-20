import { client } from "../../../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useLocation } from "@docusaurus/router";
import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "../styles.module.css";
import { motion } from "framer-motion";


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
    console.log(posts);

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


    // const formatted = breadcrumbs.map((item, index) => {
    //     let word = item.toLowerCase();

    //     if (index > 0 && word.endsWith('s')) {
    //         word = word.slice(0, -1); // remove last 's'
    //     }

    //     return word;
    //     });



    return (
        <>
            <div className={clsx(styles.navbar)}>
            {posts?.map((post, i) => {
                           // Transform breadcrumbs first
                const formattedBreadcrumbs = post._sys.breadcrumbs.map((bar, j) => {
                    let word = bar.toLowerCase();
                    if (j > 1 && word.endsWith("s")) {
                    word = word.slice(0, -1); // remove 's'
                    }
                    return word;
                });

                return (
                    <div key={i}>
                    {formattedBreadcrumbs.map((word, j) => {
                        const href = "/" + formattedBreadcrumbs.slice(0, j + 1).join("/");

                        const displayWord = word.charAt(0).toUpperCase() + word.slice(1);

                            return (
                            <span key={j}>
                                {j > 0 && " / "}
                                <Link to={href}>{displayWord}</Link>
                            </span>
                            );
                    })}
                    </div>
                );
                })}

            </div>


            <div className={clsx( styles.container)}>
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
                        whileTap={{ scale: 0.98 }}
                        >
                        <h2 className={clsx(styles.pageTitle)}>{post.title}</h2>
                        <TinaMarkdown content={post.body} />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className={clsx(styles.side)}
                    variants={containerVariantsSidebar}
                    initial="hidden"
                    animate="show"
                    >
                    {/* 🔹 How to Section */}
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

                    {/* 🔹 Manage Quotations Section */}
                    <motion.h2 variants={itemVariantsSidebar}>Manage Quotations</motion.h2>
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

                    <hr />

                    {/* 🔹 Related Process Section */}
                    <motion.h3 variants={itemVariantsSidebar}>Related Process</motion.h3>
                    <motion.p variants={itemVariantsSidebar}>
                        It's gonna be the next step in the sales process.
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
                </motion.div>
            </div>

        </>
      );
}