import clsx from "clsx";
import styles from "./styles.module.css";

export const VideoPlayer = ({ videoUrl, caption }) => {
    let regex =
        /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    var videoId = regex.exec(videoUrl)[3];

  return (
    <div className={clsx(styles.video_player_container)}>
      <div className={clsx(styles.video_wrapper)}>
        
      <iframe
            width="720"
            height="480"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
          />
      </div>
      {caption && <p className={clsx(styles.video_caption)}>{caption}</p>}
    </div>
  );
};
