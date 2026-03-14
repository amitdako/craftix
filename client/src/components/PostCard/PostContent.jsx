import React from "react";
import * as s from "./PostCard.styles";

const PostContent = ({
  currentLang,
  title,
  content,
  mediaUrl,
  mediaType,
  getImageUrl,
  onNavigate,
}) => (
  <div onClick={onNavigate} style={{ cursor: "pointer" }}>
    {mediaUrl && (
      <div style={s.mediaWrapperStyle}>
        {mediaType === "video" ? (
          <video
            src={getImageUrl(mediaUrl)}
            controls
            style={s.mediaContentStyle}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img src={getImageUrl(mediaUrl)} style={s.mediaContentStyle} alt="" />
        )}
      </div>
    )}
    <div style={{ padding: "0 15px 15px 15px", textAlign: "inherit" }}>
      {title && (
        <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>{title}</h3>
      )}
      <p style={s.contentTextStyle}>{content}</p>
    </div>
  </div>
);

export default PostContent;
