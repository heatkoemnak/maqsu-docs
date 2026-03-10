import clsx from "clsx";
import styles from "./styles.module.css";
import { Card } from "./Card";

export const CardGrid = ({ cards }) => {
  return (
    <div className={clsx(styles.card_grid)}>
      {cards?.map((card, i) => (
        <Card key={i} {...card} />
      ))}
    </div>
  );
};
