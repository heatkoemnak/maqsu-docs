import React from "react";
import { defineConfig, TextField,LocalAuthProvider } from "tinacms";
import { UsernamePasswordAuthJSProvider } from 'tinacms-authjs/dist/tinacms'

import { ReferenceField } from "tinacms";
import { FeaturesBlockTemplate } from "../src/components/Features/template";
import { CategoriesTemplate } from "../src/components/Templates/template";
import { HeroBlockTemplate } from "../src/components/Hero/template";
import { YouTubeEmbedBlockTemplate } from "../src/components/YouTubeEmbed/template";
import { MDXTemplates } from "../src/theme/template";
import { docusaurusDate, titleFromSlug } from "../util";
import title from "title";
import { ProtobufNullValue } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";
// import { FeaturesBlockTemplate } from "../src/components/Started/FeatureSection/template";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
const WarningIcon = (props) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.001 10h2v5h-2zM11 16h2v2h-2z"></path>
      <path d="M13.768 4.2C13.42 3.545 12.742 3.138 12 3.138s-1.42.407-1.768 1.063L2.894 18.064a1.986 1.986 0 0 0 .054 1.968A1.984 1.984 0 0 0 4.661 21h14.678c.708 0 1.349-.362 1.714-.968a1.989 1.989 0 0 0 .054-1.968L13.768 4.2zM4.661 19 12 5.137 19.344 19H4.661z"></path>
    </svg>
  );
};

const RestartWarning = () => {
  return (
    <p className="rounded-lg border shadow px-4 py-2.5 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 mb-4">
      <div className="flex items-center gap-2">
        <WarningIcon className={`w-6 h-auto flex-shrink-0 text-yellow-400`} />
        <div className={`flex-1 text-sm text-yellow-700 whitespace-normal	`}>
          To see settings changes reflected on your site, restart the Tina CLI
          after saving <em>(local development only)</em>.
        </div>
      </div>
    </p>
  );
};

const PostCollection = {
  name: "post",
  label: "Posts",
  path: "blog",
  format: "mdx",
  ui: {
    defaultItem: () => {
      return {
        date: docusaurusDate(new Date()),
      }
    }
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      name: "authors",
      label: "Authors",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.name };
        },
      },
      fields: [
        {
          name: "name",
          label: "Name",
          type: "string",
          isTitle: true,
          required: true,
        },
        {
          name: "title",
          label: "Title",
          type: "string",
        },
        {
          name: "url",
          label: "URL",
          type: "string",
        },
        {
          name: "image_url",
          label: "Image URL",
          type: "string",
        },
      ],
    },
    {
      name: "date",
      label: "Date",
      type: "string",
      required: true,
      ui: {
        dateFormat: "MMM D, yyyy",
        component: "date",
        parse: (val) => {
          return docusaurusDate(val);
        },
      },
    },
    {
      label: "Tags",
      name: "tags",
      type: "string",
      list: true,
      ui: {
        component: "tags",
      },
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [...MDXTemplates],
    },
  ],
};

const DocsCollection = {
  name: "doc",
  label: "Docs",
  path: "docs",
  format: "mdx",

  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
    {
      label: "Tags",
      name: "tags",
      type: "string",
      list: true,
      ui: {
        component: "tags",
      },
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [...MDXTemplates],
    },
  ],
};


const DocLinkTemplate = {
  name: "doc",
  label: "Doc Link",
  ui: {
    itemProps: (item) => {
      return {
        label: item?.label
          ? item?.label
          : item?.document
            ? titleFromSlug(item?.document)
            : item.name,
      };
    },
  },
  fields: [
    {
      label: "Document",
      name: "document",
      type: "reference",
      collections: ["doc"],
      isTitle: true,
      required: true,
    },
    {
      name: "label",
      label: "Label",
      description: "By default this is the document title",
      type: "string",
    },
  ],
};

const ExternalLinkTemplate = {
  name: "link",
  label: "External Link",
  ui: {
    itemProps: (item) => {
      return {
        label: item?.title ? item?.title : item.name,
      };
    },
  },
  fields: [
    {
      name: "title",
      label: "Label",
      type: "string",
      isTitle: true,
      required: true,
    },
    {
      name: "href",
      label: "URL",
      type: "string",
      required: true,
    },
  ],
};

const CategoryFields = [
  {
    name: "title",
    label: "Title",
    type: "string",
    isTitle: true,
    required: true,
  },
  {
    name: "link",
    label: "Link",
    type: "string",
    options: [
      {
        label: "None",
        value: "none",
      },
      {
        label: "Document",
        value: "doc",
      },
      {
        label: "Generated Index",
        value: "generated",
      },
    ],
  },
  {
    name: "docLink",
    label: "Document",
    type: "reference",
    collections: ["doc"],
    ui: {
      component: (props) => {
        const link = React.useMemo(() => {
          let fieldName = props.field.name;
          fieldName =
            fieldName.substring(0, fieldName.lastIndexOf(".")) || fieldName;

          return fieldName
            .split(".")
            .reduce((o, i) => o[i], props.tinaForm.values).link;
        }, [props.tinaForm.values]);

        if (link !== "doc") {
          return null;
        }

        return ReferenceField(props);
      },
    },
  },
];

const ItemsField = {
  name: "items",
  label: "Items",
  type: "object",
  list: true,
};

const CategoryTemplateProps = {
  name: "category",
  label: "Category",
  ui: {
    itemProps: (item) => {
      return {
        label: item?.title ? item?.title : item.name,
      };
    },
    defaultItem: {
      link: "none",
    },
  },
};

// const CategoryTemplate = {
//   ...CategoryTemplateProps,
//   fields: [
//     ...CategoryFields,
//     {
//       ...ItemsField,
//       templates: [
//         {
//           ...CategoryTemplateProps,
//           fields: [
//             ...CategoryFields,
//             {
//               ...ItemsField,
//               templates: [
//                 {
//                   ...CategoryTemplateProps,
//                   fields: [
//                     ...CategoryFields,
//                     {
//                       ...ItemsField,
//                       templates: [DocLinkTemplate, ExternalLinkTemplate],
//                     },
//                   ],
//                 },
//                 DocLinkTemplate,
//                 ExternalLinkTemplate,
//               ],
//             },
//           ],
//         },
//         DocLinkTemplate,
//         ExternalLinkTemplate,
//       ],
//     },
//   ],
// };

// const SidebarItemsField = {
//   ...ItemsField,
//   templates: [CategoryTemplate, DocLinkTemplate, ExternalLinkTemplate],
// };

// const SidebarCollection = {
//   name: "sidebar",
//   label: "Docs Sidebar",
//   path: "config/sidebar",
//   format: "json",
//   ui: {
//     global: true,
//     allowedActions: {
//       create: false,
//       delete: false,
//     },
//   },
//   fields: [
//     {
//       type: "string",
//       name: "_warning",
//       ui: {
//         component: () => {
//           return <RestartWarning />;
//         },
//       },
//     },
//     {
//       type: "string",
//       label: "Label",
//       name: "label",
//       required: true,
//       isTitle: true,
//       ui: {
//         component: "hidden",
//       },
//     },
//     SidebarItemsField,
//   ],
// };

// const NavbarItemFields = [
//   {
//     name: "label",
//     label: "Label",
//     type: "string",
//     isTitle: true,
//     required: true,
//   },
//   {
//     name: "link",
//     label: "Link",
//     type: "string",
//     options: [
//       {
//         label: "None",
//         value: "none",
//       },
//       {
//         label: "Document",
//         value: "doc",
//       },
//       {
//         label: "Page",
//         value: "page",
//       },
//       {
//         label: "Blog",
//         value: "blog",
//       },
//       {
//         label: "External",
//         value: "external",
//       },
//     ],
//   },
//   {
//     name: "docLink",
//     label: "Document",
//     type: "reference",
//     collections: ["doc"],
//     ui: {
//       component: (props) => {
//         const link = React.useMemo(() => {
//           let fieldName = props.field.name;
//           fieldName =
//             fieldName.substring(0, fieldName.lastIndexOf(".")) || fieldName;

//           return fieldName
//             .split(".")
//             .reduce((o, i) => o[i], props.tinaForm.values).link;
//         }, [props.tinaForm.values]);

//         if (link !== "doc") {
//           return null;
//         }

//         return ReferenceField(props);
//       },
//     },
//   },
//   {
//     name: "pageLink",
//     label: "Page",
//     type: "reference",
//     collections: ["pages"],
//     ui: {
//       component: (props) => {
//         const link = React.useMemo(() => {
//           let fieldName = props.field.name;
//           fieldName =
//             fieldName.substring(0, fieldName.lastIndexOf(".")) || fieldName;

//           return fieldName
//             .split(".")
//             .reduce((o, i) => o[i], props.tinaForm.values).link;
//         }, [props.tinaForm.values]);

//         if (link !== "page") {
//           return null;
//         }

//         return ReferenceField(props);
//       },
//     },
//   },
//   {
//     name: "externalLink",
//     label: "URL",
//     type: "string",
//     ui: {
//       component: (props) => {
//         const link = React.useMemo(() => {
//           let fieldName = props.field.name;
//           fieldName =
//             fieldName.substring(0, fieldName.lastIndexOf(".")) || fieldName;

//           return fieldName
//             .split(".")
//             .reduce((o, i) => o[i], props.tinaForm.values).link;
//         }, [props.tinaForm.values]);

//         if (link !== "external") {
//           return null;
//         }

//         return TextField(props);
//       },
//     },
//   },
//   {
//     name: "position",
//     label: "Position",
//     type: "string",
//     required: true,
//     options: [
//       {
//         label: "Left",
//         value: "left",
//       },
//       {
//         label: "Right",
//         value: "right",
//       },
//     ],
//     ui: {
//       component: "button-toggle",
//     },
//   },
// ];

// const NavbarSubitemProps = {
//   name: "items",
//   label: "Items",
//   type: "object",
//   list: true,
//   ui: {
//     itemProps: (item) => ({
//       label: item.label,
//     }),
//   },
// };

// const SettingsCollection = {
//   label: "Settings",
//   name: "settings",
//   path: "config/docusaurus",
//   format: "json",
//   ui: {
//     global: true,
//     allowedActions: {
//       create: false,
//       delete: false,
//     },
//   },
//   fields: [
//     {
//       type: "string",
//       name: "_warning",
//       ui: {
//         component: () => {
//           return <RestartWarning />;
//         },
//       },
//     },
//     {
//       type: "string",
//       label: "Label",
//       name: "label",
//       required: true,
//       isTitle: true,
//       ui: {
//         component: "hidden",
//       },
//     },
//     {
//       type: "object",
//       label: "Logo",
//       name: "logo",
//       fields: [
//         {
//           type: "string",
//           label: "Alt Text",
//           name: "alt",
//         },
//         {
//           type: "image",
//           label: "Source",
//           name: "src",
//         },
//       ],
//     },
//     {
//       type: "string",
//       label: "Title",
//       name: "title",
//       required: true,
//     },
//     {
//       type: "string",
//       label: "Tagline",
//       name: "tagline",
//     },
//     {
//       type: "string",
//       label: "URL",
//       name: "url",
//       required: true,
//     },
//     {
//       type: "object",
//       label: "Navbar",
//       name: "navbar",
//       list: true,
//       ui: {
//         itemProps: (item) => ({
//           label: item.label + " - " + title(item.position),
//         }),
//         defaultItem: {
//           position: "left",
//         },
//       },
//       fields: [
//         ...NavbarItemFields,
//         {
//           ...NavbarSubitemProps,
//           fields: [
//             ...NavbarItemFields,
//             {
//               ...NavbarSubitemProps,
//               fields: NavbarItemFields,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: "object",
//       label: "Footer",
//       name: "footer",
//       fields: [
//         {
//           name: "style",
//           label: "Style",
//           type: "string",
//           options: [
//             {
//               label: "Dark",
//               value: "dark",
//             },
//             {
//               label: "Light",
//               value: "light",
//             },
//           ],
//           ui: {
//             component: "button-toggle",
//           },
//         },
//         {
//           type: "object",
//           label: "Categories",
//           name: "links",
//           list: true,
//           ui: {
//             itemProps: (item) => ({
//               label: item.title,
//             }),
//           },
//           fields: [
//             {
//               type: "string",
//               label: "Title",
//               name: "title",
//             },
//             {
//               type: "object",
//               label: "Links",
//               name: "items",
//               list: true,
//               templates: [
//                 {
//                   name: "internal",
//                   label: "Internal",
//                   ui: {
//                     itemProps: (item) => ({
//                       label: item.label,
//                     }),
//                   },
//                   fields: [
//                     {
//                       type: "string",
//                       label: "Label",
//                       name: "label",
//                     },
//                     {
//                       type: "reference",
//                       label: "Page",
//                       name: "to",
//                       collections: ["doc", "pages", "post"],
//                     },
//                   ],
//                 },
//                 {
//                   name: "blog",
//                   label: "Blog",
//                   ui: {
//                     defaultItem: {
//                       label: "Blog",
//                     },
//                     itemProps: (item) => ({
//                       label: item.label,
//                     }),
//                   },
//                   fields: [
//                     {
//                       type: "string",
//                       label: "Label",
//                       name: "label",
//                     },
//                   ],
//                 },
//                 {
//                   name: "external",
//                   label: "External",
//                   ui: {
//                     itemProps: (item) => ({
//                       label: item.label,
//                     }),
//                   },
//                   fields: [
//                     {
//                       type: "string",
//                       label: "Label",
//                       name: "label",
//                     },
//                     {
//                       type: "string",
//                       label: "URL",
//                       name: "href",
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: "string",
//           label: "Copyright",
//           name: "copyright",
//         },
//       ],
//     },
//   ],
// };

const HomepageCollection = {
  name: "homepage",
  label: "Homepage",
  description:
    "To see settings changes reflected on your site, you must restart the Tina CLI after saving changes (local development only).",
  path: "config/homepage",
  format: "json",
  ui: {
    allowedActions: {
      create: true,
      delete: false,
    },
  },
  fields: [
    {
      type: "string",
      name: "_warning",
      ui: {
        component: () => {
          return <RestartWarning />;
        },
      },
    },
    {
      type: "string",
      label: "Label",
      name: "label",
      required: true,
      isTitle: true,
      ui: {
        component: "hidden",
      },
    },
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
    {
      name: "image",
      label: "Image",
      type: "image",
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Blocks",
      templates: [
        HeroBlockTemplate,
        FeaturesBlockTemplate,
        YouTubeEmbedBlockTemplate,
      ],
    },
  ],
};

const GettingStartedCollection = {
  name: "gettstarted",
  label: "Getting Started",
  description:
    "To see settings changes reflected on your site, you must restart the Tina CLI after saving changes (local development only).",
  path: "config/gettstarted",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: "string",
      name: "_warning",
      ui: {
        component: () => {
          return <RestartWarning />;
        },
      },
    },
    {
      type: "string",
      label: "Label",
      name: "label",
      required: true,
      isTitle: true,
      ui: {
        component: "hidden",
      },
    },
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
     {
      name: "image",
      label: "Image",
      type: "image",
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Blocks",
      templates: [
        HeroBlockTemplate,
        FeaturesBlockTemplate,
        YouTubeEmbedBlockTemplate,
      ],
    },
  ],
};

const SalesCollection = {
  name: "sales",
  label: "Sales",
  description:
    "To see settings changes reflected on your site, you must restart the Tina CLI after saving changes (local development only).",
  path: "config/sales",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: "string",
      name: "_warning",
      ui: {
        component: () => {
          return <RestartWarning />;
        },
      },
    },
     {
      type: "string",
      name: "route",
      label: "URL",
    },
    {
      type: "string",
      label: "Label",
      name: "label",
      required: true,
      isTitle: true,
      ui: {
        component: "hidden",
      },
    },
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
     {
      name: "image",
      label: "Image",
      type: "image",
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Blocks",
      templates: [
        HeroBlockTemplate,
        FeaturesBlockTemplate,
        YouTubeEmbedBlockTemplate,
      ],
    },
  ],
};

const PurchaseCollection = {
  name: "purchase",
  label: "Purchase",
  description:
    "To see settings changes reflected on your site, you must restart the Tina CLI after saving changes (local development only).",
  path: "config/purchase",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: "string",
      name: "_warning",
      ui: {
        component: () => {
          return <RestartWarning />;
        },
      },
    },
    {
      type: "string",
      label: "Label",
      name: "label",
      required: true,
      isTitle: true,
      ui: {
        component: "hidden",
      },
    },
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
     {
      name: "image",
      label: "Image",
      type: "image",
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Blocks",
      templates: [
        HeroBlockTemplate,
        FeaturesBlockTemplate,
        YouTubeEmbedBlockTemplate,
      ],
    },
  ],
};

const AccountingCollection = {
  name: "accounting",
  label: "Accounting",
  description:
    "To see settings changes reflected on your site, you must restart the Tina CLI after saving changes (local development only).",
  path: "config/accounting",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: "string",
      name: "_warning",
      ui: {
        component: () => {
          return <RestartWarning />;
        },
      },
    },
    {
      type: "string",
      label: "Label",
      name: "label",
      required: true,
      isTitle: true,
      ui: {
        component: "hidden",
      },
    },
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
     {
      name: "image",
      label: "Image",
      type: "image",
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Blocks",
      templates: [
        HeroBlockTemplate,
        FeaturesBlockTemplate,
        YouTubeEmbedBlockTemplate,
      ],
    },
  ],
};

const InventoryCollection = {
  name: "inventory",
  label: "Inventory",
  description:
    "To see settings changes reflected on your site, you must restart the Tina CLI after saving changes (local development only).",
  path: "config/inventory",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: "string",
      name: "_warning",
      ui: {
        component: () => {
          return <RestartWarning />;
        },
      },
    },
    {
      type: "string",
      label: "Label",
      name: "label",
      required: true,
      isTitle: true,
      ui: {
        component: "hidden",
      },
    },
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
     {
      name: "image",
      label: "Image",
      type: "image",
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Blocks",
      templates: [
        HeroBlockTemplate,
        FeaturesBlockTemplate,
        YouTubeEmbedBlockTemplate,
      ],
    },
  ],
};

const SettingCollection = {
  name: "setting",
  label: "Settings",
  description:
    "To see settings changes reflected on your site, you must restart the Tina CLI after saving changes (local development only).",
  path: "config/settings",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: "string",
      name: "_warning",
      ui: {
        component: () => {
          return <RestartWarning />;
        },
      },
    },
    {
      type: "string",
      label: "Label",
      name: "label",
      required: true,
      isTitle: true,
      ui: {
        component: "hidden",
      },
    },
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
     {
      name: "image",
      label: "Image",
      type: "image",
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Blocks",
      templates: [
        HeroBlockTemplate,
        FeaturesBlockTemplate,
        YouTubeEmbedBlockTemplate,
      ],
    },
  ],
};


const subLinkTemplate = {
  name: "features",
  label: "Sub Links",
  fields: [
     {
        type: "string",
        name: "link",
        label: "URL",
        description: "Link to the feature page"},
    {
      type: "string",
      name: "title",
      label: "Title"
    },
    {
      type: "image",
      name: "icon",
      label: "Icon"
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
    }

  ],
};






const PagesCollection = {
  name: "pages",
  label: "Pages",
  path: "src/pages",
  format: "mdx",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
    // {
    //   type: "object",
    //   name: "how_to",
    //   label: "How To",
    //   list: true,
    //   ui: {
    //     itemProps: (item) => ({
    //       label: item?.title || "Untitled Feature",
    //       icon: "⭐", // (optional) adds emoji or icon
    //     }),
    //   },
    //   fields: subLinkTemplate.fields
    // },
    {
      type: "object",
      name: "breadcrumbs",
      label: "Breadcrumbs",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Feature",
          icon: "⭐", // (optional) adds emoji or icon
        }),
      },
      fields: subLinkTemplate.fields
    },
    {
      type: "object",
      name: "managements",
      label: "Managements",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Feature",
          icon: "⭐", // (optional) adds emoji or icon
        }),
      },
      fields: subLinkTemplate.fields
    },
    {
      type: "object",
      name: "related",
      label: "Related Process",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Feature",
          icon: "⭐", // (optional) adds emoji or icon
        }),
      },
      fields: subLinkTemplate.fields
    },
    {
      type: "object",
      name: "previous",
      label: "PEVIOUS",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Feature",
          icon: "⭐", // (optional) adds emoji or icon
        }),
      },
      fields: subLinkTemplate.fields
    },
    {
      type: "object",
      name: "next",
      label: "NEXT",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Feature",
          icon: "⭐", // (optional) adds emoji or icon
        }),
      },
      fields: subLinkTemplate.fields
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [...MDXTemplates],
    },


  ],
};

const TabsTemplateNew= {
     name: "tabsesctions",
      label: "Tabs",
      fields: [
        {
          type: "object",
          name: "lists",
          label: "Tabs Sections",
          ui: {
            itemProps: (item) => ({
              label: item?.label || "Untitled Feature",
              icon: "⭐", // (optional) adds emoji or icon
            }),
          },
          list: true,
          fields: [
            { name: "label", label: "Label", type: "string" },
            {
              name: "children",
              label: "Body",
              type: "rich-text",
              isBody: true,
              templates: [...MDXTemplates],
            },

          ],
        },

      ],
};

const Sections = {
  name: "sections",
  label: "Sections",
  fields: [
    {
      type: "string",
      name: "link",
      label: "URL",
      description: "Link to the feature page",
    },
     {
      type: "string",
      name:"uid",
      label: "ID",
      description: "Unique identifier for the section group, used for linking and referencing"
    },
    {
      type: "string",
      name: "title",
      label: "Title",
    },
    {
      type: "image",
      name: "icon",
      label: "Icon",
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [...MDXTemplates,TabsTemplateNew],
    },
  ],
};



const breadcrumps = {
  name: "features",
  label: "Sub Links",
  fields: [
     {
        type: "string",
        name: "link",
        label: "URL",
        description: "Link to the feature page"},
    {
      type: "string",
      name: "title",
      label: "Title"
    },
    {
      type: "image",
      name: "icon",
      label: "Icon"
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
    }

  ],
};




const GroupSections = {
  name: "groupSections",
  label: "Group Sections",
  fields: [

    {
      type: "string",
      name: "link",
      label: "URL",
      description: "Link to the feature page",
    },
     {
      type: "string",
      name:"uid",
      label: "ID",
      description: "Unique identifier for the section group, used for linking and referencing"
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Section",
          icon: "⭐",
        }),
      },
    },
     {
        name: "date",
        label: "Date & Time",
        type: "string",
        required: false,
        ui: {
          component: "date",
          dateFormat: "YYYY-MM-DD",
          parse: (val) => {
            if (!val) return new Date().toISOString();

            // Keep selected date but inject current time
            const selected = new Date(val);
            const now = new Date();

            selected.setHours(
              now.getHours(),
              now.getMinutes(),
              now.getSeconds(),
              now.getMilliseconds()
            );

            return selected.toISOString();
          },
        },
      },
     {
      type: "object",
      name: "breadcrumbs",
      label: "Breadcrumbs",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Feature",
          icon: "⭐", // (optional) adds emoji or icon
        }),
      },
      fields: breadcrumps.fields
    },
    {
      type: "object",
      list: true,
      name: "sections",
      label: "Sections",
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Section",
          icon: "⭐",
        }),
      },
      fields: Sections.fields,
    },
    {
      type: "image",
      name: "icon",
      label: "Icon",
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      templates: [...MDXTemplates],
    },
  ],
};

const Topic = {
  name: "topic",
  label: "Topic",
  fields: [
    {
      type: "string",
      name: "link",
      label: "URL",
      description: "Link to the feature page",
    },
     {
      type: "string",
      name:"uid",
      label: "ID",
      description: "Unique identifier for the topic, used for linking and referencing"
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Section",
          icon: "⭐",
        }),
      },
    },
    {
      name: "date",
      label: "Date & Time",
      type: "string",
      required: false,
      ui: {
        component: "date",
        dateFormat: "YYYY-MM-DD",
        parse: (val) => {
          if (!val) return new Date().toISOString();

          // Keep selected date but inject current time
          const selected = new Date(val);
          const now = new Date();

          selected.setHours(
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
          );

          return selected.toISOString();
        },
      },
    },
    {
      type: "image",
      name: "icon",
      label: "Icon",
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
  ],
};

const TopicsTemplate ={
  name: "topics",
  label: "Topic",
  path: "topics",
  format: "mdx",
  fields: [
    {
      type: "object",
      list: true,
      name: "topics",
      label: "Topics",
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Topic",
          icon: "⭐",
        }),
      },
      fields: Topic.fields // ✅ better approach
    },
  ],
}

const DocCategoryCollection = {
  name: "categories",
  label: "Document Categories",
  path: "pages/Categories",
  format: "mdx",
  fields: [

    {
      type: "string",
      name: "link",
      label: "URL",
    },
     {
      type: "string",
      name:"uid",
      label: "ID",
      description: "Unique identifier for the section group, used for linking and referencing"
    },
    {
      type: "string",
      name: "title",
      label: "Category Title",
    },
    {
      type: "string",
      name: "slug",
      label: "Slug",
      required: true,
      ui: {
        validate: (value) => {
          if (!value) return "Slug is required";
          if (value.includes(" ")) return "Slug cannot contain spaces";
        },
      },
    },
    {
      type: "string",
      name: "description",
      label: "Description",
    },
    {
      type: "object",
      list: true,
      name: "groupSections",
      label: "Group Sections",
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Group Section",
          icon: "⭐",
        }),
      },
      fields: GroupSections.fields // ✅ better approach
    },
  ],
};


export default defineConfig({
  branch: process.env.TINA_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "9ecacd79-23a8-46cb-8198-3bbe6c466ff0",
  token: process.env.TINA_TOKEN || "868a447170da07eba440b3cb591ad7b3f236d270",
  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "static",
    },
  },
  schema: {
    collections: [
      TopicsTemplate,
      DocCategoryCollection,
      DocsCollection,
      PostCollection,
      HomepageCollection,
      GettingStartedCollection,
      SalesCollection,
      PurchaseCollection,
      AccountingCollection,
      InventoryCollection,
      SettingCollection,
      PagesCollection,
      // SidebarCollection,
      // SettingsCollection,
    ],
  },
});
