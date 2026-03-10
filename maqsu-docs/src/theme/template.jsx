import React from "react";
import { slugify } from "../../util";

const AdmonitionTemplate = {
  name: "Admonition",
  ui: {
    defaultItem: {
      type: "note",
      title: "Note",
    },
    itemProps: (item) => {
      return { label: item?.title };
    },
  },
  fields: [
    {
      name: "type",
      label: "Type",
      type: "string",
      options: [
        {
          label: "Note",
          value: "note",
        },
        {
          label: "Tip",
          value: "tip",
        },
        {
          label: "Info",
          value: "info",
        },
        {
          label: "Caution",
          value: "caution",
        },
        {
          label: "Danger",
          value: "danger",
        },
      ],
    },
    {
      name: "title",
      label: "Title",
      type: "string",
      isTitle: true,
      required: true,
    },
    {
      name: "children",
      label: "Content",
      type: "rich-text",
    },
  ],
};

const DetailsTemplate = {
  name: "Details",
  fields: [
    {
      name: "summary",
      label: "Summary",
      type: "string",
      isTitle: true,
      required: true,
    },
    {
      name: "children",
      label: "Details",
      type: "rich-text",
    },
  ],
};

const CodeBlockTemplate = {
  name: "CodeBlock",
  label: "Code Block",
  fields: [
    {
      name: "title",
      label: "Filename",
      type: "string",
    },
    {
      name: "language",
      label: "Language",
      type: "string",
    },
    {
      name: "children",
      label: "Code",
      type: "rich-text",
      required: true,
    },
  ],
};


const TabsTemplate = {
  name: "Tabs",
  fields: [
    {
      name: "children",
      label: "Tabs",
      type: "rich-text",
      templates: [
        {
          name: "TabItem",
          label: "Tab",
          ui: {
            defaultItem: {
              label: "Tab",
              value: "tab",
            },
          },
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
              isTitle: true,
              required: true,
            },
            {
              name: "value",
              type: "string",
              ui: {
                component: ({ input, tinaForm }) => {
                  React.useEffect(() => {
                    input.onChange(slugify(tinaForm.values.label));
                  }, [JSON.stringify(tinaForm.values)]);

                  return (
                    <input
                      type="text"
                      id={input.name}
                      className="hidden"
                      {...input}
                    />
                  );
                },
              },
            },
            {
              name: "children",
              label: "Content",
              type: "string",
              ui: {
                component: "textarea",
              },
            },
          ],
        },
      ],
    },
  ],
};


const TabsPageTemplate = {
  name: "tab",
  label: "Tab",
  fields: [
    {
      name: "id",
      type: "string",
      ui: {
        component: "hidden",
      },
    },
    {
      name: "label",
      label: "Label",
      type: "string",
      isTitle: true,
      required: true,
    },
    {
      name: "children",
      label: "Body",
      type: "rich-text",
      isBody: true,
    },
  ],
}


// const TabsTemplateNew= {
//      name: "tabsesctions",
//       label: "Tabs",
//       fields: [
//         {
//           type: "object",
//           name: "lists",
//           label: "Tabs Sections",
//           ui: {
//             itemProps: (item) => ({
//               label: item?.label || "Untitled Feature",
//               icon: "⭐", // (optional) adds emoji or icon
//             }),
//           },
//           list: true,
//           fields: [
//             { name: "label", label: "Label", type: "string" },
//             {
//               name: "children",
//               label: "Body",
//               type: "rich-text",
//               isBody: true,
//               templates: [],
//             },

//           ],
//         },

//       ],
// };


// const CustomTabsPage = {
//   name: "CustomTabsPage",
//   label: "Custom Tabs",
//   fields: [TabSection]
// }
// const TabSection ={
//   name: "tabsections",
//   label: "Tabs Section",
//   type: "object",
//   list: true,   // 👈 THIS makes it an array
//   templates: [
//     {
//       name: "tab",
//       label: "Tab",
//       fields: [
//         {
//           name: "label",
//           label: "Label",
//           type: "string",
//           isTitle: true,
//           required: true,
//         },
//         {
//           name: "children",
//           label: "Body",
//           type: "rich-text",
//           isBody: true,
//         },
//       ],
//     }
//   ]
// }

const DocCardListTemplate = {
  name: "DocCardList",
  label: "Doc Card List",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
  ],
};

const CardTemplate = {
      name: "Card",
      name: "CardGrid",
      label: "Card Grid",
      fields: [
        {
          type: "object",
          name: "cards",
          label: "Cards",
          ui: {
            itemProps: (item) => ({
              label: item?.title || "Untitled Feature",
              icon: "⭐", // (optional) adds emoji or icon
            }),
          },
          list: true,
          fields: [
            { name: "title", label: "Title", type: "string" },
            { name: "description", label: "Description", type: "string" },
            { name: "image", label: "Image", type: "image" },
          ],
        },

      ],
};

const ListTemplate = {
     name: "Lists",
      label: "Lists",
      fields: [
        {
          type: "object",
          name: "lists",
          label: "Lists",
          ui: {
            itemProps: (item) => ({
              label: item?.title || "Untitled Feature",
              icon: "⭐", // (optional) adds emoji or icon
            }),
          },
          list: true,
          fields: [
            { name: "title", label: "Title", type: "string" },
            { name: "description", label: "Description", type: "string" },
            { name: "image", label: "Image", type: "image" },
            {
              type: "object",
              name: "sublists",
              label: "SubLists",
              ui: {
                itemProps: (item) => ({
                  label: item?.title || "Untitled Feature",
                  icon: "⭐", // (optional) adds emoji or icon
                }),
              },
              list: true,
              fields: [
                { name: "title", label: "Title", type: "string" },
                { name: "link", label: "Link", type: "string" },
                { name: "description", label: "Description", type: "string" },
                { name: "image", label: "Image", type: "image" },
              ]
          },
          ],
        },

      ],
};


const VideoPlayerTemplate = {
  name: "VideoPlayer",
  name: "VideoPlayer",
  label: "Video Player",
  fields: [
    {
      name: "videoUrl",
      label: "Video URL",
      type: "string",
    },
    {
      name: "caption",
      label: "Caption",
      type: "string",
    },
    {
      type: "string",
      name: "video",
      label: "Video Upload",
      ui: {
        component: "image", // allows uploading video too if enabled
      },
    },
  ],
};

const ProcessFlow = {
  name: "ProcessFlow",
  label: "Process Flow",
  fields: [
    {
      type: "object",
      name: "steps",
      label: "Steps",
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Untitled Feature",
          icon: "⭐", // (optional) adds emoji or icon
        }),
      },
      list: true,
      fields: [
        { name: "title", label: "Step Title", type: "string" },
        { name: "description", label: "Step Description", type: "string" },
      ],
    },
  ],
};

const Noted = {
  name:"Noted",
  label:"Noted",
  fields:[
    {
      name: "title",
      label: "Title",
      type: "string",
      isTitle: true,
      required: true,
    },
    {
      name: "type",
      label: "Type",
      type: "string",
      options: [
        {
          label: "Note",
          value: "note",
        },
        {
          label: "Tip",
          value: "tip",
        },
        {
          label: "Info",
          value: "info",
        },
        {
          label: "Caution",
          value: "caution",
        },
        {
          label: "Danger",
          value: "danger",
        },
      ],
    },
    {
      name: "children",
      label: "Content",
      type: "rich-text",
      isBody: true,
            // Enable link support
      tinaField: {
        mutations: {
          insertLink: true,
        },
      },
    },
     { name: "image", label: "Image", type: "image" },
  ],
}


const Steps = {
  name:"Steps",
  label:"Steps",
  fields:[
    {
      name: "title",
      label: "Title",
      type: "string",
      isTitle: true,
      required: true,
    },
    {
      name: "number",
      label: "Step Number",
      type: "string",
      options: [
        {
          label: "Step 1",
          value: "1",
        },
        {
          label: "Step 2",
          value: "2",
        },
        {
          label: "Step 3",
          value: "info",
        },
        {
          label: "Step 4",
          value: "4",
        },
        {
          label: "Step 5",
          value: "5",
        },
        {
          label: "Step 6",
          value: "6",
        },
        {
          label: "Step 7",
          value: "7",
        },
        {
          label: "Step 8",
          value: "8",
        },
        {
          label: "Step 9",
          value: "9",
        },
        {
          label: "Step 10",
          value: "10",
        },
      ],
    },

  ],
}



export const MDXTemplates = [
  AdmonitionTemplate,
  DetailsTemplate,
  CodeBlockTemplate,
  TabsTemplate,
  DocCardListTemplate,
  ListTemplate,
  CardTemplate,
  VideoPlayerTemplate,
  ProcessFlow,
  Noted,
  Steps,
  // TabsTemplateNew
];
