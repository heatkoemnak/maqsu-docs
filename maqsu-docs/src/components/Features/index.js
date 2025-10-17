import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

const Feature = ({link, image, title, description }) => {
  return (
    <div className={clsx("col col--4", styles.card)}>
      <Link to={`/${link}`} className={styles.cardLink}>
      {image && (
        <div className={clsx("text--center",styles.img)}>
          <img className={styles.featureSvg} src={image} role="img" />
        </div>
      )}
      <div className={ clsx("text--center padding-horiz--md", styles.cardContent)}>
        {title && <h2>{title}</h2>}
        {description && <p>{description}</p>}
      </div>
      </Link>
    </div>
  );
};

export const Features = ({ data, index }) => {
  console.log(data);
  return (
    <div key={index} className={styles.features}>
      {/* <div className="container"> */}
        <div className="row">
          {data.items.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      {/* </div> */}
    </div>
  );
};
