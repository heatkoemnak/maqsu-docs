import "./note.css";
import notes from "../../../static/img/icon/notes.png";
import warning from "../../../static/img/icon/warning.png";
import tips from "../../../static/img/icon/tips.png";
import tip from "../../../static/img/icon/tip.png";

const NOTE_CONFIG = {
  info: {
    tone: "info",
    defaultTitle: "Note",
    icon: notes,
  },
  warning: {
    tone: "warning",
    defaultTitle: "Warning",
    icon: warning,
  },
  success: {
    tone: "success",
    defaultTitle: "Success",
    icon: tips,
  },
  danger: {
    tone: "danger",
    defaultTitle: "Important",
    icon: tip,
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
          <img src={config.icon} className="note__icon" alt="" />
        </div>
        <span className="note__title">{heading}</span>
      </div>

      <div className="note__content">{children}</div>
    </aside>
  );
};
