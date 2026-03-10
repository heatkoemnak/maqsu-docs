
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

export const List = ({ title,link, description, image
    , sublists: sub
 }) => {
  return (
    <div className={clsx(styles.card)}>
      <div>

      {image && <img src={image} alt={title} className={clsx(styles.card_image)}/>}
      <h3 className={clsx(styles.card_title)}>{title}</h3>
      </div>
      <p className={clsx(styles.card_description)}>{description}</p>
      <ul className={clsx(styles.card_link_description)}>
        {sub?.map((item, index) => (
          <li key={index}>
            <Link to={item.link} className={clsx(styles.card_link)} key={index}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
