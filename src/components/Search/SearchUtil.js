/**
 * MDX Content Indexer
 *
 * This utility helps extract searchable content from your MDX documentation structure
 * Usage: Import this in your Search component to build the search index
 */

/**
 * Extract searchable items from MDX-based documentation structure
 * @param {Object} moduleData - The MDX data structure (e.g., accountingData)
 * @returns {Array} Array of searchable items
 */
export function extractSearchableContent(moduleData) {
  const items = [];

  if (!moduleData || !moduleData.groupSections) {
    return items;
  }

  const moduleName = moduleData.title || "Documentation";
  const moduleLink = moduleData.link || "";

  // Process each group section
  moduleData.groupSections.forEach((group) => {
    // Add the group itself as a searchable item
    items.push({
      title: group.title,
      description: group.body || "",
      link: `/${moduleLink}${group.link}`,
      category: moduleName,
      type: "section",
      breadcrumbs: group.breadcrumbs || [],
      date: group.date || null,
    });

    // Process individual sections/articles within the group
    if (group.sections && Array.isArray(group.sections)) {
      group.sections.forEach((section) => {
        // Clean the body text for description
        const cleanBody = section.body
          ? section.body
              .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
              .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Keep link text only
              .replace(/#{1,6}\s/g, "") // Remove markdown headers
              .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
              .replace(/\*([^*]+)\*/g, "$1") // Remove italic
              .replace(/`([^`]+)`/g, "$1") // Remove code formatting
              .replace(/<[^>]+>/g, "") // Remove HTML tags
              .replace(/\n+/g, " ") // Replace newlines with spaces
              .trim()
          : "";

        items.push({
          title: section.title,
          description: cleanBody.substring(0, 300), // Limit description length
          link: section.link,
          category: `${moduleName} > ${group.title}`,
          type: "article",
          uid: section.uid || null,
          breadcrumbs: group.breadcrumbs || [],
        });
      });
    }
  });

  return items;
}

/**
 * Build a complete search index from multiple modules
 * @param {Array} modules - Array of module data objects
 * @returns {Array} Combined search index
 */
export function buildSearchIndex(modules) {
  const allItems = [];

  modules.forEach((module) => {
    const items = extractSearchableContent(module);
    allItems.push(...items);
  });

  return allItems;
}

/**
 * Search through the index with relevance scoring
 * @param {Array} index - The search index
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array} Sorted array of search results
 */
export function searchIndex(index, query, maxResults = 10) {
  if (!query || !query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const searchTerms = lowerQuery.split(" ").filter(term => term.length > 1);

  const results = index
    .map((item) => {
      const title = (item.title || "").toLowerCase();
      const description = (item.description || "").toLowerCase();
      const category = (item.category || "").toLowerCase();

      let score = 0;

      // Exact title match - highest priority
      if (title === lowerQuery) {
        score += 100;
      }

      // Title starts with query
      if (title.startsWith(lowerQuery)) {
        score += 75;
      }

      // Title contains query
      if (title.includes(lowerQuery)) {
        score += 50;
      }

      // Description contains full query
      if (description.includes(lowerQuery)) {
        score += 25;
      }

      // Category match
      if (category.includes(lowerQuery)) {
        score += 15;
      }

      // Individual term matches
      searchTerms.forEach(term => {
        if (title.includes(term)) score += 10;
        if (description.includes(term)) score += 5;
        if (category.includes(term)) score += 3;
      });

      // Boost for article type (more specific content)
      if (item.type === "article") {
        score *= 1.2;
      }

      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      // Sort by score first
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Then by title length (shorter = more specific)
      return a.title.length - b.title.length;
    })
    .slice(0, maxResults);

  return results;
}

/**
 * Extract unique categories from the search index
 * @param {Array} index - The search index
 * @returns {Array} Array of unique categories with links
 */
export function extractCategories(index) {
  const categoriesMap = new Map();

  index.forEach((item) => {
    if (item.type === "section") {
      const categoryKey = item.category;
      if (!categoriesMap.has(categoryKey)) {
        categoriesMap.set(categoryKey, {
          title: item.title,
          link: item.link,
          category: item.category,
        });
      }
    }
  });

  return Array.from(categoriesMap.values());
}

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} Text with highlight markers
 */
export function highlightText(text, query) {
  if (!query || !text) return text;

  const terms = query.toLowerCase().split(" ").filter(t => t.length > 1);
  let result = text;

  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, "gi");
    result = result.replace(regex, "<mark>$1</mark>");
  });

  return result;
}

export default {
  extractSearchableContent,
  buildSearchIndex,
  searchIndex,
  extractCategories,
  highlightText,
};