import React from "react";
import { FeatureSections } from "./2ndDepth";
import { HeroContent } from "../HeroContent";
import { useLocation } from "@docusaurus/router";
import { ALERT } from "../ALERTS";

// Normalize paths so trailing/leading slashes don't break matching
// e.g. "/sales/add-discount/" and "sales/add-discount" both -> "sales/add-discount"
const normalize = (path) => (path || "").replace(/^\/+|\/+$/g, "");

export const LayoutContents = ({ blocks }) => {
  const location = useLocation();

  // Get the items from the second block safely
  const items = blocks?.[1]?.items || [];

  const currentPath = normalize(location.pathname);

  // Find the block that matches the current pathname (slash-insensitive)
  const matchedBlock = items.find(
    (block) => normalize(block.link) === currentPath
  );

  // Useful for debugging or listing available links
  if (typeof window !== "undefined") {
    // Only log in the browser to keep SSR build logs clean
    console.log("Available links:", items.map((b) => b.link));
  }

  // If no match found, show a safe fallback.
  // IMPORTANT: never let this branch throw or use browser-only APIs,
  // since it also runs during static site generation (SSR/SSG).
  if (!matchedBlock) {
    const message = `Inside your content editor, please add a correct link to this page.
  The current pathname is: ${location.pathname}.
  Available links are: ${items.map((b) => b.link).join(", ") || "none"}.`;

    // During SSG (no window), render a minimal, guaranteed-safe fallback
    if (typeof window === "undefined") {
      return (
        <div style={{ padding: "2rem" }}>
          <p><strong>Your URL is mismatched</strong></p>
          <p style={{ whiteSpace: "pre-line" }}>{message}</p>
        </div>
      );
    }

    // In the browser, use the richer ALERT component
    return <ALERT title="Your URL is mismatched" message={message} />;
  }

  // Otherwise, render the matched content
  return (
    <>
      <div data-tinafield={`blocks.${matchedBlock._template}`}>
        <HeroContent data={matchedBlock} />
      </div>
      <div data-tinafield={`blocks.${matchedBlock._template}`}>
        <FeatureSections data={matchedBlock} />
      </div>
    </>
  );
};