import clsx from "clsx";
import styles from "./styles.module.css";
import { List } from "./List";

export const Lists = ({lists}) => {
  return (
    <div className={clsx(styles.card_grid)}>
        {lists?.map((list, i) => (
              <List key={i} {...list} />
          ))}
    </div>
  );
};
