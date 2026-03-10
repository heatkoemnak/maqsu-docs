import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';


export const Steps = ({ title,number }) => {

  return (
    <div className={clsx(styles.step_container)}>
      <div className={clsx(styles.step)}>
          <span>
              Step
          </span>
          <span>{number}:</span>
      </div>
      <div className={clsx(styles.step_title)}>
          <span>{title}</span>
      </div>
    </div>
  );
};

