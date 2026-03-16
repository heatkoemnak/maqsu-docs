
import clsx from "clsx";
import styles from "./styles.module.css";
import { FaRegCircleCheck } from "react-icons/fa6";

export const Card = ({ title, description }) => {
  return (
    <div className={clsx(styles.card, styles.card_compact)}>
      {/* <div className={clsx(styles.card_icon_wrap, styles.card_icon_wrap_compact)} aria-hidden="true">
        <FaRegCircleCheck className={clsx(styles.card_icon, styles.card_icon_compact)} />
      </div> */}
      <span className={clsx(styles.card_title, styles.card_title_compact)}>{title}</span>
      <p className={clsx(styles.card_description, styles.card_description_compact)}>{description}</p>
    </div>
  );
};
