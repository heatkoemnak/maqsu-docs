import React from "react";
import { HiMiniMapPin } from "react-icons/hi2";
import "./note.css";

const NOTE_CONFIG = {
  info: {
    tone: "info",
    defaultTitle: "Note",
  },
  warning: {
    tone: "warning",
    defaultTitle: "Warning",
  },
  success: {
    tone: "success",
    defaultTitle: "Success",
  },
  danger: {
    tone: "danger",
    defaultTitle: "Important",
  },
};

export const Noted = ({ title, type = "info", children }) => {
  const normalizedType = type === "caution" ? "warning" : type;
  const config = NOTE_CONFIG[normalizedType] || NOTE_CONFIG.info;
  const heading = title || config.defaultTitle;

  return (
    <aside className={`note note--${config.tone}`}>
      <div className="note__header">
        <div className="note__icon-wrap" aria-hidden="true">
          <HiMiniMapPin className="note__pin" />
        </div>
        <span className="note__title">{heading}</span>
      </div>

      <div className="note__content">{children}</div>
    </aside>
  );
};
