import React from "react";
import './note.css';
import { TinaMarkdown } from "tinacms/dist/rich-text";

const NOTE_CONFIG = {
  info: {
    header: "note-header--info",
    body: "note-body--info",
    defaultIcon: "✦",
  },
  caution: {
    header: "note-header--caution",
    body: "note-body--caution",
    defaultIcon: "⚠",
  },
  success: {
    header: "note-header--success",
    body: "note-body--success",
    defaultIcon: "✔",
  },
  danger: {
    header: "note-header--danger",
    body: "note-body--danger",
    defaultIcon: "✕",
  },
};

export const Noted = ({ title, type = "success", image, children }) => {
  const config = NOTE_CONFIG[type] || NOTE_CONFIG.info;

  return (
    <div className="note">
      {/* Header bar */}

      {/* Body */}
      <div className={`note-body ${config.body}`}>
        <div className={`note-header ${config.header}`}>
          {image ? (
            <img src={image} className="note-header__icon" alt="" aria-hidden="true" />
          ) : (
            <span className="note-header__icon-fallback" aria-hidden="true">
              {config.defaultIcon}
            </span>
          )}
          <span className="note-header__title">{title}</span>
        </div>
        <TinaMarkdown content={children} />
      </div>
    </div>
  );
};