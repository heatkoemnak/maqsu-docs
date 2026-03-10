import React from "react";
import { FeatureSections } from "./2ndDepth";
import { HeroContent } from "../HeroContent";
import { useLocation } from "@docusaurus/router";
import { ALERT } from "../ALERTS";

export const LayoutContents = ({ blocks }) => {
  const location = useLocation();

  // Get the items from the second block safely
  const items = blocks?.[1]?.items || [];

  // Find the block that matches the current pathname
  const matchedBlock = items.find((block) => block.link === location.pathname);

  // (Optional) Useful for debugging or listing available links
  console.log("Available links:", items.map((b) => b.link));

  // If no match found, show alert
  if (!matchedBlock) {
    return (
      <ALERT
        title="Your URL is mismatched"
        message={`Inside your content editor, please add a correct link to this page.
                  The current pathname is: ${location.pathname}.
                  Available links are: ${items.map((b) => b.link).join(", ") || "none"}.`}
      />
    );
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
