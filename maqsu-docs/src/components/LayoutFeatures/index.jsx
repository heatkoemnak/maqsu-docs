import React from "react";
import { Hero } from "../Hero";
import { FeatureSections } from "./FeatureSection";
// import { YouTubeEmbed } from "../YouTubeEmbed";

export  const LayoutFeatures = ({ blocks }) => {
  console.log(blocks);
  // console.log(blocks);
  // console.log(blocks[0]._template);

  return (
    <>
      {blocks
        ? blocks.map(function (block, i) {
            switch (block._template) {
              // case "hero":
              //   return (
              //     <div data-tinafield={`blocks.${i}`} key={i + block._template}>
              //       <Hero data={block} index={i} />
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
