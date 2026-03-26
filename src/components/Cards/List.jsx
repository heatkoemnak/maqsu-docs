import clsx from "clsx";
import Link from "@docusaurus/Link";
import { ArrowRight } from "lucide-react";
import "./list.css"

const styles = {


};

export const List = ({ title, link, description, image, sublists: sub }) => {
  return (
    <div className="list-card">
      <div className="list-card-header">
          <span className="list-card-title">
            {title}
          </span>
          <div style={styles.title_accent} className="list-title-accent" />
      </div>

      <p style={styles.card_description} className="list-card-description">
        {description}
      </p>

      {sub && sub.length > 0 && (
        <div style={styles.links_container}>
          <ul style={styles.card_link_list} className="list-card-link-list">
            {sub.map((item, index) => (
              <li
                key={index}
                style={styles.link_item}
                className="list-link-item"
              >
                <Link
                  to={item.link}
                  style={styles.card_link}
                  className="list-card-link"
                >
                  <span style={styles.link_text}>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {link && (
        <Link to={link} style={styles.cta_button} className="list-cta-button">
          <span>Explore</span>
          <ArrowRight size={16} style={{ transition: "transform 150ms" }} />
        </Link>
      )}
    </div>
  );
};