
import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

export const ALERT = ({
  title = "Deactivate account",
  message = "Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.",
}) => {
  return (
    <div className={clsx(styles.card)}>
      <div className={clsx(styles.header)}>
        <div className={clsx(styles.image)}>
          <svg
            aria-hidden="true"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
          </svg>
        </div>

        <div className={clsx(styles.content)}>
          <span className={clsx(styles.title)}>{title}</span>
          <p className={clsx(styles.message)}>{message}</p>
        </div>

        <div className={clsx(styles.actions)}>
          <button
            className={clsx(styles.desactivate)}
            type="button"
          >
            Deactivate
          </button>
          <button
            className={clsx(styles.cancel)}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
