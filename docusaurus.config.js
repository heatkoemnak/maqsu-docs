const docusaurusData = require("./config/docusaurus/index.json");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function topicsDataPlugin() {
  return {
    name: "topics-data",
    async loadContent() {
      const filePath = path.resolve(__dirname, "topics", "topic.mdx");
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);

      return {
        topics: Array.isArray(data?.topics) ? data.topics : [],
      };
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}

function categoriesDataPlugin() {
  return {
    name: "categories-data",
    async loadContent() {
      const categoriesDir = path.resolve(__dirname, "pages", "Categories");
      const entries = fs.readdirSync(categoriesDir, { withFileTypes: true });
      const mdxFiles = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
        .map((entry) => entry.name);

      const bySlug = {};
      for (const fileName of mdxFiles) {
        const slug = fileName.replace(/\.mdx$/, "");
        const filePath = path.join(categoriesDir, fileName);
        const raw = fs.readFileSync(filePath, "utf8");
        const { data } = matter(raw);
        bySlug[slug] = data || {};
      }

      return { bySlug };
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}

// const lightCodeTheme = require("prism-react-renderer").themes.github;
// const darkCodeTheme = require("prism-react-renderer").themes.dracula;

const getDocId = (doc) => {
  return doc
    .replace(/\.mdx?$/, "")
    .split("/")
    .slice(1)
    .join("/");
};

const getPageRoute = (page) => {
  return page
    .replace(/\.mdx?$/, "")
    .split("/")
    .slice(2)
    .join("/");
};

const getPath = (page) => {
  return page.replace(/\.mdx?$/, "");
};

const formatFooterItem = (item) => {
  if (item.title) {
    return {
      title: item.title,
      items: item.items.map((subItem) => {
        return formatFooterItem(subItem);
      }),
    };
  } else {
    let linkObject = {
      label: item.label,
    };

    if (item.to) {
      linkObject.to = getPath(item.to);
    } else if (item.href) {
      linkObject.href = item.href;
    } else {
      linkObject.to = "/blog";
    }

    return linkObject;
  }
};

const formatNavbarItem = (item, subnav = false) => {
  let navItem = {
    label: item.label,
  };

  if (!subnav) {
    navItem.position = item.position;
  }

  if (item.link === "external" && item.externalLink) {
    navItem.href = item.externalLink;
  }

  if (item.link === "blog") {
    navItem.to = "/blog";
  }

  if (item.link === "page" && item.pageLink) {
    navItem.to = getPageRoute(item.pageLink);
  }

  if (item.link === "doc" && item.docLink) {
    navItem.type = "doc";
    navItem.docId = getDocId(item.docLink);
  }

  if (item.items) {
    navItem.type = "dropdown";
    navItem.items = item.items.map((subItem) => {
      return formatNavbarItem(subItem, true);
    });
  }

  return navItem;
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: docusaurusData.title || "My Site",
  tagline: docusaurusData.tagline || "Dinosaurs are cool",
  url: docusaurusData.url || "maqsu-documents.netlify.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          showReadingTime: true,
          editUrl: docusaurusData.url + "/admin/#/collections/post",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [topicsDataPlugin, categoriesDataPlugin],

  // themeConfig:
  //   /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  //   ({
  //     navbar: {
  //       title: docusaurusData.title || "Maqsu",
  //       logo: {
  //         alt: docusaurusData?.logo?.alt
  //           ? docusaurusData?.logo?.alt
  //           : "My Logo",
  //         src: docusaurusData?.logo?.src
  //           ? docusaurusData?.logo?.src
  //           : "img/logo/maqsu.svg",
  //       },
  //       items: docusaurusData.navbar.map((item) => {
  //         return formatNavbarItem(item);
  //       }),
  //     },

  //     footer: {
  //       style: docusaurusData.footer?.style || "dark",
  //       links: docusaurusData.footer?.links.map((item) => {
  //         return formatFooterItem(item);
  //       }),
  //       copyright:
  //         `Copyright © ${new Date().getFullYear()} ` +
  //         (docusaurusData.footer?.copyright || docusaurusData.title),
  //     },
  //     prism: {
  //       theme: lightCodeTheme,
  //       darkTheme: darkCodeTheme,
  //     },

  //   }),
};

module.exports = config;
