import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export const Card = ({ title, description, link }) => {
  const isExternal = typeof link === "string" && /^(https?:)?\/\//.test(link);
  const Wrapper = link ? Link : "div";
  const wrapperProps = link
    ? {
        className: clsx(styles.card, styles.card_compact, styles.card_clickable),
        ...(isExternal
          ? { href: link, target: "_blank", rel: "noopener noreferrer" }
          : { to: String(link).replace(/\/+/g, "/") }),
      }
    : { className: clsx(styles.card, styles.card_compact) };

  return (
    <Wrapper {...wrapperProps}>
      <span className={clsx(styles.card_title, styles.card_title_compact)}>{title}</span>
      <p className={clsx(styles.card_description, styles.card_description_compact)}>{description}</p>
    </Wrapper>
  );
};
