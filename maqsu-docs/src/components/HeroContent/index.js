import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import { getDocPath, titleFromSlug } from "../../../util";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
export const HeroContent = ({ data, index }) => {
  console.log(data);

  const { siteConfig } = useDocusaurusContext();

  return (
    <header
      key={index}
      className={clsx("hero hero--primary", styles.heroBanner)}
    >
      <div className="container">
        <h1 className="hero__title">
          {data.title ? data.title : siteConfig.title}
        </h1>
        <p className="hero__subtitle">
          {data.description ? data.description : null}
        </p>
      </div>
    </header>
  );
};
