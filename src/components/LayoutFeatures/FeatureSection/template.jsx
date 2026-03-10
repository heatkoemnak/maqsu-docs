import React from "react";
import { SubSectionBlockTemplate } from "./SubSection/template";

const subFeatureTemplate = {
  name: "subFeature",
  label: "Sub Feature",
  fields: [
    { type: "string", name: "title", label: "Title" },
    { type: "string", name: "description", label: "Description" },
    {
      name: "related_page",
      label: "Related Page (MDX)",
      type: "reference",
      collections: ["pages"], // 👈 connect JSON to MDX
    },
    { type: "image", name: "icon", label: "Icon" },
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
        description: "Link to the feature page",},
        {
          name: "image",
          label: "Image",
          type: "image",
        },

      ],
    },
    {
      type: "object",
      name: "features",
      label: "Sub Features",
      list: true,
      templates: [subFeatureTemplate], // 👈 nested template here
    },
  ],
};
