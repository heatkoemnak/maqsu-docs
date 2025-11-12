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



export const MDXTemplates = [
  AdmonitionTemplate,
  DetailsTemplate,
  CodeBlockTemplate,
  TabsTemplate,
  DocCardListTemplate,
  CardTemplate,
  VideoPlayerTemplate,
  ProcessFlow
];
