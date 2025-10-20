import clsx from "clsx";
import styles from "./styles.module.css";

const CardSlider = () => {
  const sliderClick = (item) => {
    console.log("Card clicked:", item);
  };


  return(
    <div className={clsx(styles.cardSlider)}>
        <h1 className={clsx(styles.heading)}>Related Process</h1>

    </div>
  )
};

export default CardSlider;
