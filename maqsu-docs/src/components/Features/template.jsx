import React from "react";

const subFeatureTemplate = {
  name: "features",
  label: "Sub Feature",
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
      name: "related_page",
      label: "Related Page (MDX)",
      type: "reference",
      collections: ["pages"], // 👈 connect JSON to MDX
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description"
    },
    {
      type: "image",
      name: "icon",
      label: "Icon"
    },
  ],
};
export const FeaturesBlockTemplate = {
  name: "features",
  label: "Features",
  fields: [
    {
      name: "items",
      label: "Features",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item.title,
        }),
      },
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
        },
        {
          name: "description",
          label: "Description",
          type: "rich-text",
        },
        {
        type: "string",
        name: "link",
        label: "URL",
        description: "Link to the feature page"},
        {
          name: "image",
          label: "Image",
          type: "image",
        },
        {
          type: "object",
          name: "items",
          label: "Sub Features",
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.title || "Untitled Feature",
              icon: "⭐", // (optional) adds emoji or icon
            }),
          },
          fields: subFeatureTemplate.fields
        }

      ],
    },

  ],
};
