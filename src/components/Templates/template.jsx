export const CategoriesTemplate = {
    name: "categories",
    label: "Categories",
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
        name: "link",
        label: "URL",
        description: "Link to the feature page",
        type: "string",
      },
      {
        name:   "image",
        label: "Image",
        type: "image",
      },
    ],
  };
