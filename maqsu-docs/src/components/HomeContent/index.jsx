import clsx from "clsx";
import styles from "./styles.module.css";
import { Card } from "../Cards";
import { Hero } from "../Hero";
const pageData = require("../../../config/homepage/index.json");
const blocks = pageData.blocks;


export default function HomeContent({cardList = []}) {



        return (
            <div className={clsx(styles.container)}>
                 {blocks
                    ? blocks.map(function (block, i) {
                        switch (block._template) {
                            case "hero":
                            return (
                                <div data-tinafield={`blocks.${i}`} key={i + block._template}>
                                <Hero data={block} index={i} />
                                </div>
                            );
                            default:
                            return null;
                        }
                        })
                    : null}
                <br/>

                <div className={clsx(styles.header)}>
                 <h2>All Categories</h2>
                </div>
                <div className={clsx(styles.cards)}>
                    {cardList.map((card, index) => (
                        <Card
                        key={index + 1} // offset key to avoid duplication
                        link={card.link}
                        variant={card.variant}
                        title={card.title}
                        image={card.image}
                        description={card.description}
                        />
                    ))}
                </div>

            </div>

  );
}