
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
            <p className="recent">Last update 9 days ago </p>
          </div>
        </Link>
      </StyledWrapper>
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

            </div>

  );
}



const StyledWrapper = styled.div`


  .card-desc {
   padding: 15px;
   position: relative;
   top: -10px;
   display: grid;
   gap: 10px;
   background: var(--primary-clr);
  }

  .card-time {
   font-size: 0.9em;
   font-weight: 500;
   color:hsl(0, 1.40%, 27.50%)
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
   color:#24435f;
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
   color:hsl(0, 0.00%, 35.70%);
   margin-top: 12px;
  }`;
