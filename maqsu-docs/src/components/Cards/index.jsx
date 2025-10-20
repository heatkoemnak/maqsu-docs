
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { Hero } from "../Hero";
import { FaDeezer } from "react-icons/fa";
const pageData = require("../../../config/homepage/index.json");
const blocks = pageData.blocks;


export function Card({image,link, title, description, href = "#" }) {
  return (
    <div className={clsx(styles.card)}>
      <Link to={link} className={clsx(styles.card1)}>
        <h2>{title}</h2>
        <p className={clsx(styles.small)}>{description}</p>
          {image && (
              <img className={styles.featureSvg1} src={image} />
          )}
        <div className={clsx(styles.go_corner)}>
          <div className={clsx(styles.go_arrow)}>→</div>
        </div>

      </Link>
    </div>
  );
}


export default function Cards({cardList = []}) {

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