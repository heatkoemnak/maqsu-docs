import React from "react";
import { FeatureSections } from "./Contents";
import { HeroContent } from "../HeroContent";

export  const SaleContent = ({ blocks }) => {
  console.log(blocks);
  // console.log(blocks[1].items);
 const items = blocks[1].items;
 console.log(items);

  return (
    <>
      {items
        ? items?.map(function (block, i) {
            switch (block.title) {
              case "Orders":
                return (
                  <div data-tinafield={`blocks.${i}`} key={i + block._template}>
                    <HeroContent data={block} index={i} />
                  </div>
                );
              default:
                return null;
            }
          })
        : null}
        {items
          ? items.map(function (block, i) {
              switch (block.title) {
                case "Orders":
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
