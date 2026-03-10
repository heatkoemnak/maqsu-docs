import React from "react";
import { FeatureSections } from "./FeatureSection";
import { HeroContent } from "../HeroContent";
// import { YouTubeEmbed } from "../YouTubeEmbed";

export  const LayoutFeatures = ({ blocks,categories }) => {
  console.log(blocks);
  console.log(categories);

  return (
    <>
       {blocks
        ? blocks.map(function (block, i) {
            switch (block._template) {
              // case "hero":
              //   return (
              //     <div data-tinafield={`blocks.${i}`} key={i + block._template}>
              //       <HeroContent data={block} index={i} />
              //     </div>
              //   );
              case "features":
                return (
                  <div data-tinafield={`blocks.${i}`} key={i + block._template}>
                    <FeatureSections data={block}  index={i} />
                  </div>
                );

              default:
                return null;
            }
          })
        : null}
    </>
  );
};
