
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { Hero } from "../Hero";
import { FaDeezer } from "react-icons/fa";
import CardWraper from "./CardWraper";
const pageData = require("../../../config/homepage/index.json");
const blocks = pageData.blocks;
import styled from 'styled-components';


export function Card({image,link, title, description, href = "#" }) {
  return (
    // <Link to={link} className={clsx(styles.card)}>
      <StyledWrapper>
      <Link to={link} className="card work">
        <div className="card-desc">
          <div className="card-header">
            <h3 className="card-title">{title}</h3>
            <div className="card-menu">
            {image && (
            <img className={styles.featureSvg1} src={image} />
          )}
            </div>
          </div>
          <div className="card-time">{description}</div>
          <p className="recent">Last Week-36hrs</p>
        </div>
     </Link>
    </StyledWrapper>
    // </Link>
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



const StyledWrapper = styled.div`

  .card {
   font-family: "Arial";
   color: #000;
   display: grid;
   cursor: pointer;
   grid-template-rows: 150px 1fr;
   grid-template-column: 1fr; /* Added auto rows */
   margin: 10px; /* Added margin */
   --dot-clr: #BBC0FF;
   --play: hsl(195, 74%, 62%);
   width: 350px;
   border-radius: 10px;
   gap: 10px; /* Added gap */
   padding:15px
  }
  .card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-decoration: none;

  }
  .card:hover .img-section {
   transform: translateY(1em);
  }

  .card-desc {
  //  border-radius: 10px;
   padding: 15px;
   position: relative;
   top: -10px;
   display: grid;
   gap: 10px;
   background: var(--primary-clr);
  }

  .card-time {
   font-size: 1em;
   font-weight: 500;
  }

  .img-section {
   transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
   border-top-left-radius: 10px;
   border-top-right-radius: 10px;
   background: hsl(195, 74%, 62%);
  }

  .card-header {
   display: flex;
   align-items: center;
   width: 100%;
  }
   .card-header:hover {
    text-decoration: none;
   }

  .card-title {
   flex: 1;
   font-size: 1.5em;
   font-weight: 800;
  }


  .card-menu {
   display: flex;
   gap: 4px;
   margin-inline: auto;
  }

  .card svg {
   float: right;
   max-width: 100%;
   max-height: 100%;
  }

  .card .dot {
   width: 5px;
   height: 5px;
   border-radius: 50%;
   background: var(--dot-clr);
  }

  .card .recent {
   line-height: 0;
   font-size: 0.8em;
  }`;
