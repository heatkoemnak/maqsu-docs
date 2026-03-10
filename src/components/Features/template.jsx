import React from "react";


const SecondSubFeatureTemplate = {
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
      type: "rich-text",
      name: "description",
      label: "Description"
    },
    {
      type: "image",
      name: "icon",
      label: "Icon"
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
      fields: SecondSubFeatureTemplate.fields
    }
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
