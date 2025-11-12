
import clsx from "clsx";
import styles from "./styles.module.css";

export const Card = ({ title, description, image }) => {
  return (
    <div className={clsx(styles.card)}>
      {image && <img src={image} alt={title} className={clsx(styles.card_image)}/>}
      <h3 className={clsx(styles.card_title)}>{title}</h3>
      <p className={clsx(styles.card_description)}>{description}</p>
    </div>
  );
};
    